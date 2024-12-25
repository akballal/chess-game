// Helper function to determine piece color
const getPieceColor = (piece) => {
    const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
    const blackPieces = ['♚', '♛', '♜', '♝', '♞', '♟'];

    if (whitePieces.includes(piece)) return 'white';
    if (blackPieces.includes(piece)) return 'black';
    return null;
};

class ChessMoveValidator {
    constructor(board) {
        this.board = board;
    }
}

export default ChessMoveValidator;