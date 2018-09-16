const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Game = require("../../models/Game");

// @route   GET api/games/test
// @desc    Testando a rota game
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Games Works" }));

// @route   GET api/games
// @desc    Get todos os games
// @access  Public
router.get("/", (req, res) => {
  Game.find() // Quando não se passa argumentos na busca, todos os elementos são retornados
    .sort({ year: -1 })
    .then(games => res.json(games))
    .catch(err => res.status(404).json({ nogamesfound: "No games found" }));
});

// @route   GET api/games/:year/:name
// @desc    Get todos os games que se encaixam nos parametros
// @access  Public
router.get("/:year/:name", (req, res) => {
  const { year, name } = req.params;

  Game.find({
    year: year, // O ano seja exatamente o passado como argumento
    name: { $regex: name, $options: "i" } // O nome contenha o nome passado como argumento
  }) // Quando não se passa argumentos na busca, todos os elementos são retornados
    .sort({ year: -1 })
    .then(games => res.json(games))
    .catch(err => res.status(404).json({ nogamesfound: "No games found" }));
});

//@route GAME api/games
//@desc Adicionar um novo jogo ao banco de dados
//@access Public
router.post("/", (req, res) => {
  const newGame = new Game({
    name: req.body.name,
    year: req.body.year,
    description: req.body.description,
    imageURL: req.body.imageURL
  });

  newGame.save().then(game => res.json(game));
});

// @route   POST api/games/:id
// @desc    Editar game por id
// @access  Public
router.post("/:id", (req, res) => {
  Game.findById(req.params.id)
    .then(game => {
      const { name, year, description, imageURL } = req.body;

      // Editar o jogo encontrado
      game.set({
        name,
        year,
        description,
        imageURL
      });
      game.save().then(() => res.json({ success: true }));
    })
    .catch(err =>
      res.status(404).json({ gamenotfound: "No game found with this id" })
    );
});

// @route   GET api/games/:id
// @desc    Get game por id
// @access  Public
router.get("/:id", (req, res) => {
  Game.findById(req.params.id)
    .then(game => res.json(game))
    .catch(err =>
      res
        .status(404)
        .json({ nogamefound: "Nenhum game encontrado com este id" })
    );
});

// @route   POST api/games/comment/:id
// @desc    Adicionar comentario a um game
// @access  Public
router.post("/comment/:id", (req, res) => {
  Game.findById(req.params.id)
    .then(game => {
      const { commenter, text } = req.body;

      const newComment = {
        commenter,
        text
      };

      // Editar o jogo encontrado
      game.comments.unshift(newComment);
      game.save().then(() => res.json({ success: true }));
    })
    .catch(err =>
      res.status(404).json({ gamenotfound: "No game found with this id" })
    );
});

// @route   POST api/games/comment/edit/:idgame/:idcomment
// @desc    Editar um comentario de um game
// @access  Public
router.post("/comment/edit/:idgame/:idcomment", (req, res) => {
  const { text } = req.body;

  Game.update(
    { _id: req.params.idgame, "comments._id": req.params.idcomment },
    {
      $set: {
        "comments.$.text": text
      }
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    }
  );
});

// @route   POST api/games/delete/:idgame/:idcomment
// @desc    Deletar o comentario de um gmae
// @access  Public
router.delete("/comment/delete/:idgame/:idcomment", (req, res) => {
  const { idgame, idcomment } = req.params;

  Game.findByIdAndUpdate(
    idgame,
    { $pull: { comments: { _id: idcomment } } },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    }
  );
});

// @route   GET api/games/:id
// @desc    Deletar game por id
// @access  Public
router.delete("/:id", (req, res) => {
  Game.findById(req.params.id)
    .then(game => {
      // Deletar jogo encontrado
      game.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ gamenotfound: "No game found" }));
});

module.exports = router;
