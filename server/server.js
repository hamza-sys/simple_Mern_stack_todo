const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const connectDB = require("./db");
const User = require("./models/User");
const Todo = require("./models/Todo");
const authMiddleware = require("./middleware/auth");

app.use(express.json());
app.use(cors("*"));

connectDB();

app.get("/", (req, res) => {
  res.json({ name: "hamza" });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    return res.status(400).json({ message: "invalid data" });
  }

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ msg: "User already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, "verysecurekey");

    return res.status(201).json({id: newUser._id, name: newUser.name, token});
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "incorrect fields values" });
    }
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, "verysecurekey");

    return res.status(201).json({id: user._id, name: user.name, token});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// get all todos
app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user.id
    });

    if (todos) {
      return res.status(200).json(todos);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Internal Server Error");
  }
});

// add todo
app.post("/add-todo", authMiddleware, async (req, res) => {
  const { name } = req.body;
  console.log(req.user)

  if (!name) {
    return res.status(400).json({ msg: "value is required" });
  }

  try {
    const todo = await new Todo({
      name,
      completed: false,
      user: req.user.id
    });

    await todo.save();

    const allTodos = await Todo.find({
      user: req.user.id
    });

    return res.status(200).json(allTodos);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

//toggle complete
app.put("/todos/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    let todo = await Todo.findById(id);

    console.log(todo)
    if (!todo) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    

    todo = await Todo.findByIdAndUpdate(
      id,
      { completed: !todo.completed },
      { new: true }
    );

    const allTodos = await Todo.find({
      user: req.user.id
    });

    return res.status(200).json(allTodos);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Internal Server Error");
  }
});

// delete a todo
app.delete('/todos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({msg: 'Provide valid Id'})
  }

  try {
    const todo = await Todo.findByIdAndDelete(id)
    if (!todo) {
      return res.status(400).json({msg: 'Invalid ID'})
    }

    const allTodos = await Todo.find({
      user: req.user.id
    })
    return res.status(200).json(allTodos)

  } catch (err) {
    console.log(err.message)
    return res.status(500).send('Internal Server Error')
  }


})

app.listen("5000", () => {
  console.log("server started");
});
