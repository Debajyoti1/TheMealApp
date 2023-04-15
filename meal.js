(() => {
    API_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='

    let mainEle = document.getElementById('main')

    let itemPair = () => {
        let attrDesc = document.createElement('div')
        attrDesc.classList.add('attrdesc')
        let attr = document.createElement('p')
        attr.classList.add('attr')
        let desc = document.createElement('p')
        desc.classList.add('desc')
        attrDesc.appendChild(attr)
        attrDesc.appendChild(desc)
        return attrDesc
    }

    let getIngridients = (data) => {
        console.log(data);
        let olist = document.createElement('ol')
        olist.classList.add('ingredients')
        for (let i = 1; i <= 20; i++) {
            if (data['strIngredient' + i] == '') break
            let liS = data['strIngredient' + i] + ' => ' + data['strMeasure' + i]
            let liE = document.createElement('li')
            liE.innerHTML = liS
            olist.appendChild(liE)
        }
        return olist
    }

    let getVideo = (data) => {
        const iframe = document.createElement('iframe');
        let yturl = data.strYoutube.split('=')
        yturl = yturl[yturl.length - 1]
        // Set the attributes for the iframe element
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + yturl);
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        return iframe
    }
    let fillDetails = async () => {
        let data = await fetchData()
        console.log(data);
        mainEle.innerHTML = ''

        let mealImg = document.createElement('img')
        mealImg.setAttribute('src', data.strMealThumb)

        let name = itemPair()
        name.children[0].innerHTML = 'Name : '
        name.children[1].innerHTML = data.strMeal

        let category = itemPair()
        category.children[0].innerHTML = 'Category : '
        category.children[1].innerHTML = data.strCategory

        let area = itemPair()
        area.children[0].innerHTML = 'Area : '
        area.children[1].innerHTML = data.strArea

        let instructions = itemPair()
        instructions.children[0].innerHTML = 'Instructions : '
        instructions.children[1].innerHTML = data.strInstructions

        let tags = itemPair()
        tags.children[0].innerHTML = 'Tags : '
        tags.children[1].innerHTML = data.strTags

        let ingredients = itemPair()
        ingredients.children[0].innerHTML = 'Ingredients : '
        ingredients.children[1].appendChild(getIngridients(data))

        let video = itemPair()
        video.children[0].innerHTML = 'Video Guide : '
        video.children[1].appendChild(getVideo(data))

        mainEle.appendChild(mealImg)
        mainEle.appendChild(name)
        mainEle.appendChild(category)
        mainEle.appendChild(area)
        mainEle.appendChild(instructions)
        mainEle.appendChild(tags)
        mainEle.appendChild(ingredients)
        mainEle.appendChild(video)
    }

    let fetchData = async () => {
        let mealID = window.location.search.split('=')[1]
        console.log(mealID)
        let data = await fetch(API_URL + mealID)
        data = await data.json()
        return data.meals[0]
    }
    fillDetails()
})()