const products=
{
    fakeDB:[],
    
    init()
    {
        this.fakeDB.push({title: 'Apple Macbook Air', category: 'Computers', image: 'applemacbookair.jpg', price: 999.99, bestSeller: 1});
        this.fakeDB.push({title: 'Apple Home Pod', category: 'Smart Home', image: 'applehomepod.jpg', price: 399.99, bestSeller: 0});
        this.fakeDB.push({title: 'Polaroid One Step 2', category: 'Cameras', image: 'polaroidonestep2.jpg', price: 149.99, bestSeller: 1});
        this.fakeDB.push({title: 'Playstation 4 - White', category: 'Videogames', image: 'playstation4white.jpg', price: 299.99, bestSeller: 1});
        this.fakeDB.push({title: 'Amazon Echo Dot', category: 'Smart Home', image: 'amazonechodot.jpg', price: 44.99, bestSeller: 1});
        this.fakeDB.push({title: 'Kodac Instamatic 133', category: 'Cameras', image: 'kodakinstamatic133.jpg', price: 99.99, bestSeller: 0});
    },

    getCategories()
    {
        let categoriesArray = [];
        let found = false;
        let indexCategories = 0;

        for (let i = 0; i < this.fakeDB.length; i++) {

            for (let j = 0; j < categoriesArray.length && !found; j++) {
                if (this.fakeDB[i].category == categoriesArray[j].category) {
                    found = true;
                }
            }

            if (!found) {
                categoriesArray[indexCategories] = this.fakeDB[i];
                indexCategories++;
                
            }
            found = false;
        }

        return categoriesArray;
    },

    getAllProducts()
    {
        return this.fakeDB;
    },

    getBestSellers()
    {

        let bestSellersArray = [];

        for (let i = 0; i < this.fakeDB.length; i++) {
            if (this.fakeDB[i].bestSeller == 1) {
                bestSellersArray[i] = this.fakeDB[i];
            }
        }

        return bestSellersArray;
    }

}

products.init();
module.exports=products;