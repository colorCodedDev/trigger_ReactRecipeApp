import React, { useState, useEffect } from "react";
import "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles.css";
import { Modal, Accordion, Card, Button } from "react-bootstrap";
import firebase from "firebase/app";
import "./Firebase";

const App = () => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const modalShow = () => setShow(true);
  const modalClose = () => setShow(true);

  const ref = firebase.firestore().collection("recipes");


  
  function getRecipes() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setRecipes(items);
      setLoading(false);
      console.log(items);
    });
  }

  

  useEffect(() => {
    getRecipes();
  }, []);

  function saveRecipe(e) {
    e.preventDefault();
    ref.collection("recipe-id").add({
      title: handleEditModal.title.value,
      ingredients: handleEditModal.ingredients.value,
    });
    setTitle("");
    setIngredients("");
  };
  

  function deleteRecipe(recipe) {
    ref
      .doc(recipe.id)
      .delete()
      .catch((err) => {
        console.log(err);
      })
      setRecipe({});
  }
  

  function addRecipe(newRecipe) {
    ref
      .doc(newRecipe.id)
      .set(newRecipe)
      .catch((err) => {
        console.log(err);
      });
    setTitle("");
    setIngredients([]);
  }

  function editRecipe(editedRecipe) {
      setLoading();
      ref 
        .doc(editedRecipe.id)
        .update(editedRecipe)
        .catch((err) => {
          console.log(err);
        });
      setTitle("");
      setIngredients([]);
  }

  function handleEditModal(editedObject) {
      handleShow();
      console.log(editedObject);
      setLoading();
      setRecipe(editedObject);
      setRecipe();
  }

  const newRecipe = async () => {
    await ref.collection.add({
      title: "",
      ingredients: ingredients,
    });
    setTitle("");
    setIngredients([]);
  }

  const handleRecipe = (event) => {
    setTitle(event.target.value);
    setIngredients(event.target.value);
  }

    

  return (
    <div>
      <div className="header-content">
          <h3 className="heading">trigger's React Recipe box</h3>
          <p className="sub-heading">
          Create, edit, delete your recipes. Uses session storage so that a page
          refresh will keep stored data (but not after page close)
          </p>
          <p className="head-link">
            <a href="https://www.freecodecamp.org/challenges/build-a-recipe-box">
            https://www.freecodecamp.org/challenges/build-a-recipe-box
            </a>
          </p>
        </div>

      <div className="modals-container">
          <div className="edit-modal">
            <Modal
              className="editRecipe"
              show={show}
              onHide={handleClose}
              >
              <Modal.Header closeButton>
                <Modal.Title>Edit Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <label>Recipe Title
                    <input
                      type="text"
                      name="title"
                      placeholder={title}
                      value={title}
                      onChange={handleRecipe}
                    />
                  </label>
                  <label>Ingredients
                    <input
                      type="text"
                      name="ingredients"
                      placeholder={ingredients}
                      value={ingredients}
                      onChange={handleRecipe}
                    />
                  </label>
                  <Button
                    className="close"
                    variant="outline-dark"
                    onClick={handleClose}
                    >
                    Close
                  </Button>
                  <Button 
                    className="update" 
                    variant="primary" 
                    onClick={saveRecipe}
                    >
                    Submit
                  </Button>
                </form>
              </Modal.Body>
            </Modal>
          </div>
          <div className="add-modal">
            <Modal
              className="addModal"
              show={show}
              onHide={modalClose}
              >
              <Modal.Header closeButton>
                <Modal.Title>Add Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Recipe Title
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter Recipe Title"
                    value={title}
                    id="addTitle"
                    onChange={handleRecipe}
                  />
                </label>
                <label>Ingredients
                  <input
                    type="text"
                    name="ingredients"
                    placeholder="Enter Ingredients, seperate each with a comma"
                    value={ingredients}
                    id="addIngredients"
                    onChange={handleRecipe}
                  />
                </label>
                <Button variant="outline-dark" onClick={modalClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={saveRecipe}>
                  Save Changes
                </Button>
                <Button variant="primary" onClick={() => addRecipe(recipe)}>
                  Submit
                </Button>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        
      <div className="accordian container">
        {recipes.map(({ title, ingredients }, i) =>  {
          return (
            <div>
              <div key={i}>
                <Accordion>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        {title}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        {ingredients.map(({ ingredient }, j) => (
                          <div key={j}>
                            <li>{recipe.ingredients}</li>
                          </div>
                        ))}



                        <Button
                          variant="info"
                          onClick={() => handleEditModal(recipe)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="delete-button"
                          variant="danger"
                          onClick={deleteRecipe}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </div>
          );
        })}
      </div>
      <div className="add-button">
        <Button
          className="add-button"
          variant="primary"
          size="sm"
          onClick={modalShow}
        >
          Add
        </Button>
      </div>     
    </div>
  );
};



export default App;
