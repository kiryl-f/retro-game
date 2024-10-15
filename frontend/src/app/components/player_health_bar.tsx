import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';  // Assuming your store file is named store.ts

const PlayerHealthBar: React.FC = () => {
    const playerHealth = useSelector((state: RootState) => state.game.playerHealth);

    return (
        <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'red', width: '200px', height: '20px' }}>
            <div style={{ backgroundColor: 'green', width: `${(playerHealth / 5) * 100}%`, height: '100%' }}></div>
        </div>
    );
};

export default PlayerHealthBar;