import React, { useEffect, useRef } from 'react';

export default function ({ value }) {
  const canvasRef = useRef(null);
  const bufferCanvasRef = useRef(null);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      const buffer = bufferCanvasRef.current;

      const ctx = canvas.getContext('2d');
      const bufferCtx = buffer.getContext('2d');
      ctx.save();

      drawBarCode(bufferCtx, value);
      const barCode = buffer.toDataURL();

      const mask = new Image();
      mask.addEventListener(
        'load',
        () => {
          ctx.drawImage(mask, 0, 0);
          ctx.globalCompositeOperation = 'source-in';

          const img = new Image();
          img.addEventListener('load', () => {
            ctx.drawImage(img, 0, 0);

            ctx.restore();
          }, false);
          img.src = barCode;
        },
        false
      );
      mask.src = require('../images/bear.png');
    };
    draw();
  }, [value]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ border: '1px solid black' }}
      />
      <canvas
        ref={bufferCanvasRef}
        width={800}
        height={400}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
}

function toBinary(input) {
  let output = '';
  for (var i = 0; i < input.length; i++) {
    output += input[i].charCodeAt(0).toString(8);
  }
  return output;
}

function drawBarCode(ctx, value) {
  const bin = toBinary(value);
  let x = 0;
  let y = 0;
  let h = 400;
  let strokes = [2, 4, 6, 8, 10, 12, 14, 16];
  let gap = 4;

  bin.split('').forEach((bit) => {
    const bitn = parseInt(bit, 10);
    const lineWidth = strokes[bitn];
    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(x, y, lineWidth, h);
    x += lineWidth + gap;
  });
}