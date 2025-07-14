import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import '../css/App.css'

import DeckId       from './DeckId'
import ButtonHolder from './ButtonHolder'
import CardHolder   from './CardHolder.jsx'

const getNewDeck = async () => {
    return await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
}

const drawCard = async (id) => {
    return await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
}

function App() {
    const [deck_id, setDeck_id] = useState(null);                       //<-- deck continuity
    const [drawnCards, setDrawnCards] = useState([]);                   //<-- cards drawn 
    const [isShuffling, setIsShuffling] = useState(false);              //<-- disabling buttons and functions when shuffling
    const [autoDraw, setAutoDraw] = useState(false);                    //<-- switch for auto draw and disabling draw and shuffle buttons
    const [isDrawing, setIsDrawing] = useState(false);                  //<-- to prevent simultaneous requests if draw card is pressed too fast
    const [reset, setReset] = useState(false);                          //<-- for overriding disable on shuffle deck button after card exhaustion
    const drawInterval = useRef(null);                                  //<-- interval_id storage when needed for clearing

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    }

    const fetchNewDeck = async () => {
        setIsShuffling(true);
        try {
            const response = await getNewDeck();
            setDeck_id(response.data.deck_id);
            //console.log('New deck_id:', response.data.deck_id);
            setDrawnCards([]);
        } catch(error) {
            alert('Error fetching deck:', error);
        } finally {
            setIsShuffling(false);
            setReset(false);
        }
    };

    const fetchCard = async () => {
        if (!deck_id || isDrawing) return;
        setIsDrawing(true);
        try {
            const response = await drawCard(deck_id);

            if (response.data.remaining === 0) {
                alert('Error: no cards remaining!');
                setAutoDraw(false);
                setIsShuffling(true);
                setReset(true);
                clearInterval(drawInterval.current);
                drawInterval.current = null;
            } else {
                //console.log('Drawn card:', response.data.cards[0].code);
                //console.log('Card image:', response.data.cards[0].image);
                setDrawnCards(cards => [...cards, response.data.cards[0]]);
            }
        } catch(error) {
            alert('Error fetching card:', error);
        } finally {
            setIsDrawing(false);
        }
    };

    useEffect(()=>{                                                     //<-- run at first render
        fetchNewDeck();
    }, []);

    useEffect(() => {                                                   //<-- run every time the autoDraw is modified ( or deck_id for resetting)                                     
        if(autoDraw && !drawInterval.current) {
            drawInterval.current = setInterval(async () => {
                fetchCard();
            }, 1000);
        } 

        if(!autoDraw && drawInterval.current) {
            clearInterval(drawInterval.current);
            drawInterval.current = null;
        }
    }, [autoDraw, deck_id]);

    return (
        <>
            <DeckId currentDeck={deck_id}></DeckId>
            <ButtonHolder 
                drawCard={fetchCard} 
                autoDrawCards={toggleAutoDraw} 
                shuffleDeck={fetchNewDeck} 
                isShuffling={isShuffling} 
                autoDraw={autoDraw}
                reset={reset}
            />
            <CardHolder>
                {drawnCards.map(card => (
                    <img
                        key={card.code}
                        src={card.image}
                        alt={`${card.value} of ${card.suit}`}
                        className='card'
                    ></img>
                ))}
            </CardHolder>
        </>
    )
}

export default App
