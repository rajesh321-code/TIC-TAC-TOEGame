from flask import Flask, render_template, request, jsonify
from game_logic import TicTacToe

app = Flask(__name__)
game = TicTacToe()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/move", methods=["POST"])
def move():
    index = int(request.json["index"])
    game.make_move(index)
    winner = game.check_winner()

    return jsonify({
        "board": game.board,
        "winner": winner,
        "next_player": game.current_player
    })

@app.route("/reset", methods=["POST"])
def reset():
    game.reset()
    return jsonify({"board": game.board})

if __name__ == "__main__":
    app.run(debug=True)