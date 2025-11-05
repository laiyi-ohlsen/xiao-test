  
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  
  //Importing the styles css 
  import "./App.css";

  //Importing the useState function from react so that everything in react response
  import { useState } from "react";

  //Define all the food categories as a constant object. 
  //Each category has an array of objects representing individual images and their names.
  const foodCategories = {
    Chinese: [
      { name: "Hot Pot", img:`${base}/images/c1.jpg`},
      { name: "Dim Sum", img: `${base}/images/c2.jpg` },
      { name: "Luo Si Fen 螺狮粉 [River Snail Rice Noodle]", img:`${base}/images/c3.jpg` },
    ],
    Malaysian: [
      { name: "Satay", img: `${base}/images/m1.jpg` },
      { name: "Prawn Laksa", img: `${base}/images/m2.jpg` },
      { name: "Nasi Lemak", img: `${base}/images/m3.jpg` },
    ],
    Korean: [
      { name: "불고기 Bulgogi", img: `${base}/images/k1.jpg` },
      { name: "Tteokbokki [Spicy Korean Rice Cakes]", img: `${base}/images/k2.jpg` },
      { name: "辛 라면 [Nongshim Shin Ramyun]", img: `${base}/images/k3.jpg` },
    ],
    Japanese: [
      { name: "Katsu Curry Rice [カレーライス]", img: `${base}/images/j1.jpg` },
      { name: "Unagi Don [Eel Rice]", img: `${base}/images/j2.jpg` },
      { name: "Sushi", img: `${base}/images/j3.jpg` },
    ],
    Vietnamese: [
      { name: "Gỏi Cuốn [Spring Rolls]", img: `${base}/images/v1.jpg` },
      { name: "Phở", img: `${base}/images/v2.jpg` },
      { name: "Bánh Mì", img: `${base}/images/v3.jpg` },
    ],
  };


  export default function App() {
    //This is where we reads the images and updates the images, goes by order -> img reads -> img updates
    const [img, setImg] = useState([]);

    //This is same idea, instead of empty array we set it to null because nothing is happening before the images gets "dragg"
    const [dragging, setDragging] = useState(null);



    //Input the "image" in the function when this image is drag, so the dragg state knows what image is being drag and updates it  
    function handleDragStart(image) {
      setDragging({ image });
    }


    //After the image is dragged into the bottom container this function runs, the imageMoved that is inside the container is found through searching the id and allows it to be drag inside the container again.
    function handleReDragStart(id) {
      const imgMoved = img.find((i) => i.id === id);

      //Set the dragging state to be the imaged that is moved into the container and updates it 
      setDragging(imgMoved);
    }


    //When image is drop don't do other stuff 
    function handleDrop(e) {
      // prevent default browser handling for drops
      e.preventDefault(); 
      // if nothing is being dragged, do nothing
      if (!dragging) return;


    //Findind the x and y position after drop into the buttom container, then reset them to be center so minus 50 it not in corner
    const imgX = e.nativeEvent.offsetX - 50;
    const imgY = e.nativeEvent.offsetY - 50;


    // Update the img state on moving an existing img or a new one
    setImg((oldImg) => {
      if (dragging.id) {

        // allows running through all old images already dropped in the bottom container, making a duplicate of the image to be dragged down again
        return oldImg.map((item) =>
          //reposition the the dumplicated image each time if its not the same one
          item.id === dragging.id ? { ...item, x: imgX, y: imgY } : item
        );
      }


      //Creates a profile for the img that just got dragged into the bottom container
      const newImg = {
        id: Date.now(), 
        img: dragging.image, 
        x: imgX,
        y: imgY,
        //a like buttom, set the deafult to 0 so its not liked so later be triggered to liked by clicking 
        liked: false, 
      };

      // add new img to existing array
      return oldImg.concat(newImg); 
    });


    setDragging(null);
  }


  // like button 
  function toggleLike(id) {

    //goes though all the old images and check the current img id match the one clicked then compare them [true -> false and false -> true]
    setImg((oldImg) =>
      oldImg.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i))
    );
    //keep the like button the same last value if its not clicked again
  }


  return (
    // Top container
    <div className="app">
      {/* Menu section at the top with categories */}
      <div className="Menu">

        {/* Searches though the food categories and maps out all the names and informations, then print out the food title */}
        {Object.entries(foodCategories).map(([category, images]) => (
          <div className="category" key={category}>

            <h3>{category} Food</h3>
            
            {/* RUns through the images and give each of them the names from the top [already provides, just matching the ids] */}
            <div className="category-images">
              {images.map(({ name, img: imgFile }) => (
                <div key={imgFile} className="image-with-name">

                  {/* Allows the images to be dragged, the dragged img file is updated into the onDragStart dragging state */}
                  <img
                    src={`/images/${imgFile}`} 
                    alt={name} 
                    draggable 
                    onDragStart={() => handleDragStart(imgFile)} 
                  />

                  {/* provide each img with food name */}
                  <p className="image-name">{name}</p>

                </div>
              ))}

            </div>
          </div>
        ))}
      </div>



      {/* Bottom container favorite board */}
      <div
        className="FavBoard"
        onDrop={handleDrop} 
        // allow user to self drag img
        onDragOver={(e) => e.preventDefault()} 
      >

        {img.map((item) => (
          // a separate div when each img is dragged the heart button does not go out of place 
          <div
            key={item.id}
            className="dropped-wrapper"
            // position inside FavBoard
            style={{ left: `${item.x}px`, top: `${item.y}px` }} 
          >


            {/* allow dropped image to be moved inside the container*/}
            <img
              src={`/images/${item.img}`}
              alt=""
              className="dropped-image"
              draggable 
              onDragStart={() => handleReDragStart(item.id)} 
            />


            {/* Heart button state to be toggled on and off */}
            <button
              className="heart-btn"
              onClick={() => toggleLike(item.id)} 
            >
              {/* heart shape on and off if its true its on else its off */}
              {item.liked ? "❤️" : "♡"} 

            </button>

          </div>
        ))}
      </div>


      {/* Labels under FavBoard container, to be spread apart span - span */}
      <div className="labels">

        <span>Least Like ❤️</span>
        <span>Like ❤️❤️</span>
        <span>Must Get It ❤️❤️❤️</span>

      </div>
    </div>
  );
}
