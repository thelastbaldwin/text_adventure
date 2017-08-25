const vorpal = require("vorpal")();
const version = require("./package.json").version;

const game = {
    x: 0,
    y: 0,
    inventory: {}
};

function move(direction){
   switch(direction){
        case "east":
        case "e":
            game.x++;
            break;
        case "west":
        case "w":
            game.x--;
            break;
        case "south":
        case "s":
            game.y--;
            break;
        case "north":
        case "n":
            game.y++;
            break;
        default:
            vorpal.log("You can't go that way");
   }
   vorpal.log(game);
}

const goNorth = move.bind(null, "north");
const goSouth = move.bind(null, "south");
const goEast = move.bind(null, "east");
const goWest = move.bind(null, "west");

vorpal
    .command("e")
    .alias("east")
    .description("go east")
    .action((args,callback) => {
        goEast();
        callback();
    });

vorpal
    .command("w")
    .alias("west")
    .description("go west")
    .action((args,callback) => {
        goWest();
        callback();
    });
vorpal
    .command("n")
    .alias("north")
    .description("go north")
    .action((args,callback) => {
        goNorth();
        callback();
    });
vorpal
    .command("s")
    .alias("south")
    .description("go south")
    .action((args,callback) => {
        goSouth();
        callback();
    });
vorpal
    .command("go [direction]")
    .description("move in a direction")
    .alias("move")
    .action((args, callback) => {
        move(args.direction);
        callback();
    });

vorpal
    .delimiter(">")
    .show();
