import { useState } from "react";
import "./index.css";
import "./App.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [show, setOnShow] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selected, setSelected] = useState(null);

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend,
      ),
    );
    setSelected(null);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setOnShow(false);
  }

  function handleSelection(friend) {
    setSelected((cur) => (cur?.id === friend.id ? null : friend));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FreindsList
          friends={friends}
          onSelection={handleSelection}
          selected={selected}
        />
        {show && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={() => setOnShow((show) => !show)}>
          {show ? "close" : "Add friend"}
        </Button>
      </div>
      {selected && (
        <FormSplitBill
          selected={selected}
          key={selected.id}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FreindsList({ friends, onSelection, selected }) {
  return (
    <ul className="friends">
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selected={selected}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selected }) {
  const isSelected = selected?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name}
          {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}
function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState(null);
  const [img, setImg] = useState("https://i.pravatar.cc/48?");

  function handleOnSubmit(e) {
    e.preventDefault();

    if (!name || !img) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      img: `${img}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={handleOnSubmit}>
        <label>🧑‍🤝‍🧑Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <label>📸Image URL</label>
        <input
          type="text"
          placeholder="https://i.pravatar.cc/48"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        ></input>
        <Button>Add</Button>
      </form>
    </div>
  );
}
function FormSplitBill({ selected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myExp, setMyExp] = useState("");
  const [whoWillPay, setWhoWillPay] = useState("user");

  const friendsExpense = bill ? bill - myExp : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myExp) return;
    onSplitBill(whoWillPay === "user" ? friendsExpense : -myExp);
    //if IM paying then my friend ows me and my balance in (positive)
    //if MYFriend is paying then I owe them and my balance is (negative)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selected.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={myExp}
        onChange={(e) =>
          setMyExp(
            Number(e.target.value) > bill ? myExp : Number(e.target.value),
          )
        }
      />

      <label> 👫 {selected.name} expense</label>
      <input type="text" disabled value={friendsExpense} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoWillPay}
        onChange={(e) => setWhoWillPay(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selected.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
}
