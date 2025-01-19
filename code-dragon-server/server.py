import os
from flask import Flask, request, jsonify, send_file
from io import BytesIO
from dotenv import load_dotenv
from pathlib import Path
from openai import OpenAI
from flask_cors import CORS
import tempfile
import subprocess
import random

app = Flask(__name__)
cors = CORS(app)

@app.route('/run-code', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code', '')

    with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as tmp_file:
        tmp_file_name = tmp_file.name
        tmp_file.write(code.encode('utf-8'))
        tmp_file.flush()

    try:
        result = subprocess.run(
            ['python', tmp_file_name],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode == 0:
            stdout = result.stdout.strip()
            return jsonify({"stdout": stdout})
        else:
            stderr = result.stderr.strip()
            return jsonify({"error": stderr}), 400

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Execution timed out."}), 400

    finally:
        if os.path.exists(tmp_file_name):
            os.remove(tmp_file_name)

@app.route('/assistant', methods=['POST'])
def assistant():
    client = OpenAI()
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({"error": "No prompt provided."}), 400

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI assistant for CodeDragon a python teaching website."},
                {"role": "user", "content": prompt}
            ]
        )
        ai_text = completion.choices[0].message.content
        print(ai_text)
        return jsonify({"response": ai_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tts', methods=['POST'])
def tts():
    data = request.get_json() or {}
    input_text = data.get("text", "").strip()
    voice = data.get("voice", "alloy")
    model = data.get("model", "tts-1")
    client = OpenAI()
    output_format = data.get("format", "mp3")

    if not input_text:
        return jsonify({"error": "No text provided"}), 400

    try:
        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=input_text
        )

        with tempfile.NamedTemporaryFile(suffix=f".{output_format}", delete=False) as tmp_file:
            temp_path = tmp_file.name
        
        response.stream_to_file(temp_path)

        with open(temp_path, "rb") as f:
            audio_data = f.read()

        os.remove(temp_path)

        mimetype = f"audio/{output_format}"
        return send_file(
            BytesIO(audio_data),
            mimetype=mimetype,
            as_attachment=False,
            download_name=f"assistant.{output_format}"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/random-challenge", methods=["POST"])
def random_challenge():
    client = OpenAI()
    data = request.get_json() or {}
    difficulty = data.get("difficulty", "medium")

    prompt = f"""
    You are a challenge generator. Create a random {difficulty} Python coding challenge.
    Return ONLY JSON in this exact shape: 
    {{
      "id": "mystery-{random.randint(1000,9999)}",
      "title": "...",
      "signature": "...",
      "description": "...",
      "tests": [
        {{"input": "...", "expectedOutput": "..."}},
        {{"input": "...", "expectedOutput": "..."}}
      ]
    }}
    Make sure 'signature' has a Python function definition, e.g. "def solve_something(...):"
    Provide exactly 2 tests, each with an 'input' that the user can pass, and an 'expectedOutput' string.
    Return NOTHING else besides the JSON. 
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9
        )
        text = response.choices[0].message.content
        challenge_data = None
        try:
            challenge_data = eval_json(text)
        except:
            pass
        
        if not challenge_data:
            return jsonify({"error": "Failed to parse challenge JSON"}), 400

        return jsonify(challenge_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def eval_json(json_str):
    import json
    import ast

    try:
        return json.loads(json_str)
    except:
        return ast.literal_eval(json_str)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


