import { SquareContents } from '../../types';
import { EmptySquare } from '../basic/emptySquare';
import { CrimsonBishop } from '../crimson/crimsonBishop';
import { CrimsonKing } from '../crimson/crimsonKing';
import { CrimsonKnight } from '../crimson/crimsonKnight';
import { CrimsonPawn } from '../crimson/crimsonPawn';
import { CrimsonQueen } from '../crimson/crimsonQueen';
import { CrimsonRook } from '../crimson/crimsonRook';
import { setUpSquare } from '../gameUtil';
import { ScourgeBishop } from '../scourge/scourgeBishop';
import { ScourgeKing } from '../scourge/scourgeKing';
import { ScourgeKnight } from '../scourge/scourgeKnight';
import { ScourgePawn } from '../scourge/scourgePawn';
import { ScourgeQueen } from '../scourge/scourgeQueen';
import { ScourgeRook } from '../scourge/scourgeRook';

const testBoard: SquareContents[][] = [
  [
    setUpSquare(0, 0, EmptySquare(), 2, 2, false),
    setUpSquare(0, 1, EmptySquare(), 2, 2, false),
    setUpSquare(0, 2, EmptySquare(), 2, 2, false),
    setUpSquare(0, 3, EmptySquare(), 2, 2, false),
    setUpSquare(0, 4, EmptySquare(), 2, 2, false),
    setUpSquare(0, 5, EmptySquare(), 2, 2, false),
    setUpSquare(0, 6, EmptySquare(), 2, 2, false),
    setUpSquare(0, 7, EmptySquare(), 2, 2, false),
    setUpSquare(0, 8, EmptySquare(), 2, 2, false),
    setUpSquare(0, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(1, 0, EmptySquare(), 2, 2, false),
    setUpSquare(1, 1, ScourgeRook(), 1, 0, true),
    setUpSquare(1, 2, ScourgeKnight(), 1, 0, true),
    setUpSquare(1, 3, ScourgeBishop(), 1, 0, true),
    setUpSquare(1, 4, ScourgeQueen(), 1, 0, true),
    setUpSquare(1, 5, ScourgeKing(), 1, 0, true),
    setUpSquare(1, 6, ScourgeBishop(), 1, 0, true),
    setUpSquare(1, 7, ScourgeKnight(), 1, 0, true),
    setUpSquare(1, 8, ScourgeRook(), 1, 0, true),
    setUpSquare(1, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(2, 0, EmptySquare(), 2, 2, false),
    setUpSquare(2, 1, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 2, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 3, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 4, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 5, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 6, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 7, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 8, ScourgePawn(), 1, 0, true),
    setUpSquare(2, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(3, 0, EmptySquare(), 2, 2, false),
    setUpSquare(3, 1, EmptySquare(), 2, 2, true),
    setUpSquare(3, 2, EmptySquare(), 2, 2, true),
    setUpSquare(3, 3, EmptySquare(), 2, 2, true),
    setUpSquare(3, 4, EmptySquare(), 2, 2, true),
    setUpSquare(3, 5, EmptySquare(), 2, 2, true),
    setUpSquare(3, 6, EmptySquare(), 2, 2, true),
    setUpSquare(3, 7, EmptySquare(), 2, 2, true),
    setUpSquare(3, 8, EmptySquare(), 2, 2, true),
    setUpSquare(3, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(4, 0, EmptySquare(), 2, 2, false),
    setUpSquare(4, 1, EmptySquare(), 2, 2, true),
    setUpSquare(4, 2, EmptySquare(), 2, 2, true),
    setUpSquare(4, 3, EmptySquare(), 2, 2, true),
    setUpSquare(4, 4, EmptySquare(), 2, 2, true),
    setUpSquare(4, 5, EmptySquare(), 2, 2, true),
    setUpSquare(4, 6, EmptySquare(), 2, 2, true),
    setUpSquare(4, 7, EmptySquare(), 2, 2, true),
    setUpSquare(4, 8, EmptySquare(), 2, 2, true),
    setUpSquare(4, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(5, 0, EmptySquare(), 2, 2, false),
    setUpSquare(5, 1, EmptySquare(), 2, 2, true),
    setUpSquare(5, 2, EmptySquare(), 2, 2, true),
    setUpSquare(5, 3, EmptySquare(), 2, 2, true),
    setUpSquare(5, 4, EmptySquare(), 2, 2, true),
    setUpSquare(5, 5, EmptySquare(), 2, 2, true),
    setUpSquare(5, 6, EmptySquare(), 2, 2, true),
    setUpSquare(5, 7, EmptySquare(), 2, 2, true),
    setUpSquare(5, 8, EmptySquare(), 2, 2, true),
    setUpSquare(5, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(6, 0, EmptySquare(), 2, 2, false),
    setUpSquare(6, 1, EmptySquare(), 2, 2, true),
    setUpSquare(6, 2, EmptySquare(), 2, 2, true),
    setUpSquare(6, 3, EmptySquare(), 2, 2, true),
    setUpSquare(6, 4, EmptySquare(), 2, 2, true),
    setUpSquare(6, 5, EmptySquare(), 2, 2, true),
    setUpSquare(6, 6, EmptySquare(), 2, 2, true),
    setUpSquare(6, 7, EmptySquare(), 2, 2, true),
    setUpSquare(6, 8, EmptySquare(), 2, 2, true),
    setUpSquare(6, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(7, 0, EmptySquare(), 2, 2, false),
    setUpSquare(7, 1, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 2, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 3, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 4, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 5, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 6, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 7, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 8, CrimsonPawn(), 0, 1, true),
    setUpSquare(7, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(8, 0, EmptySquare(), 2, 2, false),
    setUpSquare(8, 1, CrimsonRook(), 0, 1, true),
    setUpSquare(8, 2, CrimsonKnight(), 0, 1, true),
    setUpSquare(8, 3, CrimsonBishop(), 0, 1, true),
    setUpSquare(8, 4, CrimsonQueen(), 0, 1, true),
    setUpSquare(8, 5, CrimsonKing(), 0, 1, true),
    setUpSquare(8, 6, CrimsonBishop(), 0, 1, true),
    setUpSquare(8, 7, CrimsonKnight(), 0, 1, true),
    setUpSquare(8, 8, CrimsonRook(), 0, 1, true),
    setUpSquare(8, 9, EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(9, 0, EmptySquare(), 2, 2, false),
    setUpSquare(9, 1, EmptySquare(), 2, 2, false),
    setUpSquare(9, 2, EmptySquare(), 2, 2, false),
    setUpSquare(9, 3, EmptySquare(), 2, 2, false),
    setUpSquare(9, 4, EmptySquare(), 2, 2, false),
    setUpSquare(9, 5, EmptySquare(), 2, 2, false),
    setUpSquare(9, 6, EmptySquare(), 2, 2, false),
    setUpSquare(9, 7, EmptySquare(), 2, 2, false),
    setUpSquare(9, 8, EmptySquare(), 2, 2, false),
    setUpSquare(9, 9, EmptySquare(), 2, 2, false),
  ],
];

export default testBoard;
