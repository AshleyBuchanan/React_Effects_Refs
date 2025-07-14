import '../css/ButtonHolder.css'
import Button from './Button'

const ButtonHolder = ({drawCard, autoDrawCards, shuffleDeck, isShuffling, autoDraw, reset}) => {
    if (autoDraw===true) isShuffling = true;
    return (
        <div className="buttonHolder">
            <Button label="Auto Draw" action={autoDrawCards} disabled={isShuffling} isActive={autoDraw}/>
            <Button label="Draw Card" action={drawCard} disabled={isShuffling}/>
            <Button label="Shuffle Deck" action={shuffleDeck} disabled={isShuffling} reset={reset}/>
        </div>
    )
}

export default ButtonHolder;