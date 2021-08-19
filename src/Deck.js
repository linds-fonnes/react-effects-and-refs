import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);

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
    const res = await axios.get(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    );
    const card = res.data.cards[0];
    setCards((c) => [
      ...c,
      { id: card.code, name: card.suit + " " + card.value, image: card.image },
    ]);
  }

  const drawnCards = cards.map((c) => (
    <Card key={c.code} name={c.name} image={c.image} />
  ));

  return (
    <div>
      <button onClick={loadCard}>Draw Card</button>
      {drawnCards}
    </div>
  );
};

export default Deck;
