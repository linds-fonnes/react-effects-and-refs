import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function loadDeck() {
      const res = await axios.get(
        "http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(res.data);
    }
    loadDeck();
  }, [setDeck]);

  useEffect(() => {
    async function loadCard() {
      try {
        const res = await axios.get(
          `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
        );
        if (res.data.remaining === 0) {
          return setErrorMessage("No cards remaining!");
        }
        const card = res.data.cards[0];
        setCards((c) => [
          ...c,
          {
            id: card.code,
            name: card.value + " " + card.suit,
            image: card.image,
          },
        ]);
      } catch (e) {
        console.log(e);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await loadCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  const drawnCards = cards.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div>
      {errorMessage && <h1>{errorMessage}</h1>}
      <button onClick={toggleAutoDraw}>
        {autoDraw ? "Stop Drawing" : "Start Drawing"}
      </button>
      {drawnCards}
    </div>
  );
};

export default Deck;
