import { ButtonGroup, Col } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button"

import Row from "react-bootstrap/esm/Row"

interface RowProps {
  y: number;
  row: string[];
  handleAttack: (x: number, y: number) => void;
}

function GridRow({ y, row, handleAttack }: RowProps) {
  return (
    <>
      <Row>
        <ButtonGroup>

          {
            row.map((cell, x) => (<Col>
              <Button style={{ width: '2vw' }}
                key={`${x}-${y}`}
                onClick={() => handleAttack(x, y)}
              >
                {cell !== "." ? cell : "-"}
              </Button>
            </Col>))
          }
        </ButtonGroup>
      </Row>

    </>
  )
}
export default GridRow