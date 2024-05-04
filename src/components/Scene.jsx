'use client'
import React, { useEffect, useRef } from 'react'
import useWindow from './useWindow'

export default function Scene() {
  const { dimension } = useWindow();
  const canvas = useRef();
  const prevPosition = useRef(null)

  useEffect( () => {
    dimension.width > 0 && init();
  }, [dimension])

  const init = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, dimension.width, dimension.height); 
    ctx.globalCompositeOperation = "destination-out";
  }

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const manageMouseMove = (e) => {
    const { clientX, clientY, movementX, movementY } = e;

    const nbOfCircles = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;

    if(prevPosition.current != null){
      const { x, y } = prevPosition.current;
      for(let i = 0 ; i < nbOfCircles ; i++){
        const targetX = lerp(x, clientX, (1 / nbOfCircles) * i);
        const targetY = lerp(y, clientY, (1 / nbOfCircles) * i);
        draw(targetX, targetY, 50)
      }
    }

    prevPosition.current = {
      x: clientX,
      y: clientY
    }
  }

  const draw = (x, y, radius) => {
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className='relative w-full h-full'>
      {dimension.width == 0 && <div className='absolute w-full h-full bg-black'/>}
      <canvas ref={canvas} onMouseMove={manageMouseMove} height={dimension.height} width={dimension.width}/>
    </div>
  )
}
