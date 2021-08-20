import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDeck() {
      const res = await axios.get(
        "http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(res.data);
    }
    loadDeck();
  }, [setDeck]);

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

  const drawnCards = cards.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div>
      {errorMessage && <h1>{errorMessage}</h1>}
      <button onClick={loadCard}>Draw Card</button>
      {drawnCards}
    </div>
  );
};

export default Deck;
