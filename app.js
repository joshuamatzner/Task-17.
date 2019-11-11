const express = require('express')
const app = express()
const fileHandler = require('fs');

app.use(express.json())

app.get('/', function(req, res) {
    fileHandler.readFile('person.json', (err, data) => {
        if (err) res.send('File not found. First post to create file.');
        else
            res.send(`Hello World! ${data}`);
    });
});
app.get('/about', function(req, res) {
    fileHandler.readFile('person.json', (err, data) => {
        if (err) res.send('File not found. First post to create file.');
        else
            res.send(`I'm the about page! ${data}`);
    })
});

let content = JSON.parse((fileHandler.readFileSync(`data/users.json`)));
console.log(content)
app.get('/api', function(req, res) {
    res.status(200).json({
            content
    });

});
app.get('/api/v1/:id', function(req, res) {
    console.log(req.params)
    const id = req.params.id * 1;
    console.log(id)
    let item = content.find( (el) => el.id == id)
    console.log(item)
    if(item){
        res.status(200).json({
            status: 'success',
            data: {
                item
            }
        })
    } else {
        res.json({ message: `item ${id} doesn't exist`})
    }
})

app.delete('/api/:id', (req,res) => {
    const id = req.params.id;
    const updatedProjects = content.filter(item => item.id != id)
    let item = content.find( (el) => el.id == id)
    console.log(item)
    if(item == undefined){
        console.log({ message: `item ${id} doesn't exist`})
    } else {
        console.log(updatedProjects + "is the updated list")
        // exclude the item to be deleted
        content = updatedProjects;
        console.log("We are about to delete whooop whooop" + id)
    }
    
    fileHandler.writeFile('data/users.json', JSON.stringify(content), err => {
        res.status(201).json(
            {
                status: 'success',
                content: {
                    content
                }
                    });
    }); 
})

app.put('/api/:id', (req,res) => {
    const id = req.params.id * 1;
    console.log(`we are now on a put request on ${id}`)
    const ProjectBody = req.body
    const editedPost = Object.assign({id: id}, req.body);
    console.log(`Editing item no ${id} to be ${ProjectBody}`)
    const updatedProjects = []; 
    content.forEach(oldItem => {
        if(oldItem.id === id) {
            updatedProjects.push(editedPost)          
        } else {
            updatedProjects.push(oldItem)
        }
    })
    content = updatedProjects
    console.log(updatedProjects)
    res.json(content);
    fileHandler.writeFile('data/users.json', JSON.stringify(content), err => {
        res.status(201).json(
            {
                status: 'success',
                content: {
                    content
                }
                    });
    }); 
})


//app.put('/api/:id', (req,res) => {


//    const id = req.params.id * 1;
//    console.log(`we are now on a put request on ${id}`)
//    const itemBody = req.body
//    const editedPost = Object.assign({id: id}, req.body);
//    console.log(`Editing item no ${id} to be ${itemBody}`)
//    const updatedList = []; 
//    content.forEach(oldItem => {
//        if(oldItem.id === id) {
//            updatedList.push(editedPost)          
//        } else {
//            updatedList.push(oldItem)
//        }
//    })
//    content = updatedList
    // update the list items
//    console.log(updatedList)
//    res.json(content);
//    fileHandler.writeFile('data/users.json', JSON.stringify(content), err => {
//        res.status(201).json(
//            {
//                status: 'success',
//                content: {
//                   content
//                }
//                    });
//    }); 
//})












app.post('/api/add', (req,res)=> {
    const NewId = content[content.length - 1].id + 1;
    const NewProject = Object.assign({id: NewId}, req.body);
    console.log(req.body)
    content.push(NewProject);
    fileHandler.writeFile('data/users.json', JSON.stringify(content), err => {
        res.status(201).json(
            {
                status: 'success',
                content: {
                    item: NewProject
                }
                    });
    });
    console.log(req.body);
})

app.use(function(err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});