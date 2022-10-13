//variables iniciales
let shoppingCartArray = [];
let total = 0;
let productContainer = document.querySelector('.shop-items');
let totalElement = document.querySelector('.cart-total-title');

const cart = async() => {

	//peticion de preductos
		const res = await fetch('https://api.escuelajs.co/api/v1/products');
		const data = await res.json();

	//limite de cantidad de produtos
		const productsArray = data.slice(1,5)
		console.log(productsArray)

	//imprimir products en pantalla
		productsArray.forEach(product => {
			productContainer.innerHTML += `
			<div class="shop-item" id= "${product.id}">
                <span class="shop-item-title">${product.title}</span>
                    <img class="shop-item-image" src="${product.images[0]}">
                    <div class="shop-item-details">
                        <span class="shop-item-price">$${product.price}</span>
                        <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
                    </div>
            </div>`
		})

	//Escucha cuando se hace click en el boton ADD
		let addBtns = document.querySelectorAll('.shop-item-button');
		addBtns = [...addBtns]; //al NodeList lo convierto en un Array. BUENAS PRACTICAS
		

		let cartContainer = document.querySelector('.cart-items');

		addBtns.forEach(btn => { //cuando hago click en el btn, imprime 'click' en consola
			btn.addEventListener('click', event => {

		//AGREGAR PRODUCTOS AL CARRITO

			//buscar el id del producto
				let actualID = parseInt(event.target.parentNode.parentNode.id);
				console.log(actualID);

			//con el id encontrar el objeto actual
				let actualProduct = productsArray.find(item => item.id == actualID);
				
				if (actualProduct.quantity == undefined){//si no tiene cantidad dar valor 1
					actualProduct.quantity = 1;
				}

			
			//preguntar si el id del producto agregado ya existe	

				let exist = false
				shoppingCartArray.forEach (product => {
					if (actualID == product.id){
						exist = true
					} 
				})

				if (exist){
					console.log('aumentado')
					actualProduct.quantity++
				}else{
					shoppingCartArray.push(actualProduct);
				}

		//dibujar en el dom el carrito actualizado
			drawItems()

        //que se modifiquen los precios a cada evento (remove, add, o cantidad)
            getTotal()

            updateNumberOfItems()

            removeItems()

			});
		});

		
			function getTotal(){
				let sumTotal
				let total = shoppingCartArray.reduce( (sum, item)=>{
					sumTotal = sum + item.quantity*item.price
					return sumTotal
				} , 0);
				totalElement.innerText = `$${total}`
			}

			function drawItems(){
				cartContainer.innerHTML = '';//que se borre el producto anterior, y solo quede el nuevo con cantidad sumada

				shoppingCartArray.forEach(item => {

					cartContainer.innerHTML += `
					<div class="cart-row">
	                    <div class="cart-item cart-column">
	                        <img class="cart-item-image" src="${item.images[0]}" width="100" height="100">
	                        <span class="cart-item-title">${item.title}</span>
	                    </div>
	                    <span class="cart-price cart-column">$${item.price}</span>
	                    <div class="cart-quantity cart-column">
	                        <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
	                        <button class="btn btn-danger" type="button">REMOVE</button>
	                    </div>
	                </div>`
	            })
				removeItems()
	        }

	    function updateNumberOfItems(){
	    	let inputNumber = document.querySelectorAll('.cart-quantity-input');
	    	inputNumber = [...inputNumber] //transformar el NodeList a un Array

	    	inputNumber.forEach(item => {
	    		item.addEventListener('click', event=> {
		    	//conseguir el titulo del producto
		    		let actualProductTitle = event.target.parentElement.parentElement.childNodes[1].innerText;
		    		let actualProductQuantity = parseInt(event.target.value);
		    		console.log(actualProductQuantity)

		    	//buscar el producto con ese titulo
		    		let actualProductObject = shoppingCartArray.find(item => item.title == actualProductTitle);
		    		console.log(actualProductObject)

		    	//actualizar el n° de la propiedad quantity
		    		actualProductObject.quantity = actualProductQuantity;

		    	//actualizar el precio total
		    		getTotal()
		    	});
	    	});
		}

		function removeItems(){
			let removeBtns = document.querySelectorAll('.btn-danger');
			removeBtns = [...removeBtns];
			removeBtns.forEach(btn => {
				btn.addEventListener('click', event=>{
				//conseguir el titulo del producto
		    		let actualProductTitle = event.target.parentElement.parentElement.childNodes[1].innerText;

				//buscar el producto con ese titulo
		    		let actualProductObject = shoppingCartArray.find(item => item.title == actualProductTitle);

				//remover del carrito
					shoppingCartArray = shoppingCartArray.filter(item => item != actualProductObject);
					console.log(shoppingCartArray)
				
				//actualizar el precio total
					drawItems()
					updateNumberOfItems()
					getTotal()
					UpdateNumberOfItems()
				});
			});
		};
}
cart();

