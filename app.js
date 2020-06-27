const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


const workers = [];
const workerIdArray = [];

function nameValidation(name){
    if(name === ""){
        return "Answer must contain atleast one character!"
    }
    else{
        return true;
    }
}

console.log("Please assign a Manager");
inquirer.prompt([
    {
        type: "input",
        name: "manager",
        message: "What is the Manager's name? ",
        validate: nameValidation
    },
    {
        type: "input",
        name: "managerId",
        message: "What is the Manager's ID? ",
        validate: answer => {
            const isNum = answer.match(
                /^[1-9]\d*$/
            );
            if(isNum){
                return true
            }
            else if(!isNum){
                return "Please enter a positive number greater than zero."
            }
        }
    },
    {
        type: "input",
        name: "managerEmail",
        message: "What is the Manager's email? ",
        validate: answer => {
            const isEmail = answer.match(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
            if(isEmail){
                return true;
            }
            return "Please enter a valid email."
        }
    },
    {
        type: "input",
        name: "managerOfficeNumber",
        message: "What is the Manager's office number? ",
        validate: answer => {
            const isNum = answer.match(
                /^[1-9]\d*$/
            );
            if(isNum){
                return true
            }
            else{
                return "Please enter a positive number greater than zero."
            }
        }
    }
])
    .then(answers => {
        const manager = new Manager(answers.manager, answers.managerId, answers.managerEmail, answers.managerOfficeNumber);
        workers.push(manager);
        workerIdArray.push(answers.managerId);
        newWorker();
    })

function newWorker() {
    inquirer.prompt([
        {
            type: "list",
            name: "workerType",
            message: "What type of worker are you employing? ",
            choices: ["Engineer", "Intern", "Finished hiring!"]
        }
    ])
        .then(answer => {
            switch (answer.workerType) {
                case "Engineer":
                    hireEngineer();
                    break;
                case "Intern":
                    hireIntern();
                    break;
                default:
                    sendWorkers();
            }
        })
}

function hireEngineer() {
    inquirer.prompt([
        {
            type: "input",
            name: "engineerName",
            message: "What is the Engineer's name? ",
            validate: nameValidation
        },
        {
            type: "input",
            name: "engineerId",
            message: "What is the Engineer's ID number? ",
            validate: answer => {
                const isNum = answer.match(
                    /^[1-9]\d*$/
                );
                const idTaken = workerIdArray.includes(answer);
                if(isNum && !idTaken){
                    return true
                }
                else if(!isNum){
                    return "Please enter a positive number greater than zero."
                }
                else{
                    return "ID is taken, please select another";
                }
            }
        },
        {
            type: "input",
            name: "engineerEmail",
            message: "What is the Engineer's email? ",
            validate: answer => {
                const isEmail = answer.match(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
                if(isEmail){
                    return true;
                }
                return "Please enter a valid email."
            }
        },
        {
            type: "input",
            name: "engineerGithub",
            message: "What is the Engineer's GitHub username? ",
            validate: nameValidation
        }
    ])
        .then(answers => {
            const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
            workers.push(engineer);
            workerIdArray.push(answers.engineerId);
            newWorker();
        })
}

function hireIntern() {
    inquirer.prompt([
        {
            type: "input",
            name: "internName",
            message: "What is the Intern's name? ",
            validate: nameValidation
        },
        {
            type: "input",
            name: "internId",
            message: "What is the Intern's ID? ",
            validate: answer => {
                const isNum = answer.match(
                    /^[1-9]\d*$/
                );
                const idTaken = workerIdArray.includes(answer);
                if(isNum && !idTaken){
                    return true
                }
                else if(!isNum){
                    return "Please enter a positive number greater than zero."
                }
                else{
                    return "ID is taken, please select another";
                }
            }
        },
        {
            type: "input",
            name: "internEmail",
            message: "What is the Intern's email? ",
            validate: answer => {
                const isEmail = answer.match(
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
                if(isEmail){
                    return true;
                }
                return "Please enter a valid email."
            }
        },
        {
            type: "input",
            name: "internSchool",
            message: "What is the Intern's school? ",
            validate: nameValidation
        }
    ])
        .then(answers => {
            const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
            workers.push(intern);
            workerIdArray.push(answers.internId);
            newWorker();
        })
}
function sendWorkers() {
    fs.writeFileSync(outputPath, render(workers));
}
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```