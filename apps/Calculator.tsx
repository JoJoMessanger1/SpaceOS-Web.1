import React, { useState } from 'react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const calculate = () => {
    try {
      const cleanEquation = (equation + display).replace(/[^0-9+\-*/(). ]/g, '');
      // eslint-disable-next-line no-eval
      const result = eval(cleanEquation);
      setDisplay(String(Number(result.toFixed(8)))); // Limit decimals
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setShouldReset(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const buttons = [
    { label: 'C', type: 'func' }, { label: '±', type: 'func' }, { label: '%', type: 'func' }, { label: '/', type: 'op' },
    { label: '7', type: 'num' }, { label: '8', type: 'num' }, { label: '9', type: 'num' }, { label: '*', type: 'op' },
    { label: '4', type: 'num' }, { label: '5', type: 'num' }, { label: '6', type: 'num' }, { label: '-', type: 'op' },
    { label: '1', type: 'num' }, { label: '2', type: 'num' }, { label: '3', type: 'num' }, { label: '+', type: 'op' },
    { label: '0', type: 'num-wide' }, { label: '.', type: 'num' }, { label: '=', type: 'op' },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
        {/* Calculator Body - constrained width */}
        <div className="w-[320px] bg-black rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
            {/* Screen */}
            <div className="h-24 flex flex-col justify-end items-end px-2 mb-2">
                <div className="text-gray-400 text-sm h-5">{equation}</div>
                <div className="text-white text-5xl font-light tracking-tight truncate w-full text-right">
                    {display}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3">
                {buttons.map((btn, idx) => {
                    let bgClass = 'bg-[#333333] hover:bg-[#444444] text-white'; // Default number
                    if (btn.type === 'func') bgClass = 'bg-[#A5A5A5] hover:bg-[#D4D4D4] text-black';
                    if (btn.type === 'op') bgClass = 'bg-[#FF9F0A] hover:bg-[#FFB23F] text-white';
                    
                    const gridClass = btn.label === '0' ? 'col-span-2 aspect-[2/1]' : 'aspect-square';
                    const roundClass = btn.label === '0' ? 'rounded-full' : 'rounded-full';
                    const label = btn.label === '/' ? '÷' : btn.label === '*' ? '×' : btn.label;

                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                if (btn.label === 'C') clear();
                                else if (btn.label === '=') calculate();
                                else if (['+', '-', '*', '/'].includes(btn.label)) handleOperator(btn.label);
                                else if (btn.label === '±') setDisplay(String(Number(display) * -1));
                                else if (btn.label === '%') setDisplay(String(Number(display) / 100));
                                else handleNumber(btn.label);
                            }}
                            className={`${bgClass} ${gridClass} ${roundClass} text-2xl font-medium transition-colors active:brightness-125 flex items-center justify-center`}
                        >
                            <span className={btn.label === '0' ? 'pl-6 text-left w-full' : ''}>{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
