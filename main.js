import {v4 as uuidv4} from "uuid";
import fs from "node:fs";
import ExifReader from "exifreader";
import path from "path";
import { exit } from "node:process";

const base_path = import.meta.dirname;
const old_path = path.join(base_path, "old");
const new_path = path.join(base_path, "new");

if(!fs.existsSync(old_path)) {
    console.log("No 'old' folder founded");
    exit();
}

const files = fs.readdirSync(old_path);

if (files.length > 0){
    if(fs.existsSync(new_path)) fs.rmSync(new_path, { recursive: true, force: true });
    fs.mkdirSync(new_path);
}
else{
    console.log("No file founded in the old folder");
    exit();
}

files.map(file => {
    mapping(old_path, file);
});

console.log("Succes!");

async function mapping(old_path, file){
    const current_path = path.join(old_path, file);

    if(fs.lstatSync(current_path).isFile()){
        const uuid = uuidv4();
        const tags = await ExifReader.load(current_path);
        const file_type = tags.FileType.value;

        if(tags["DateTimeOriginal"]){
            const date = tags["DateTimeOriginal"].value[0] ?? null;

            if(date) save(uuid, current_path, date, file_type);
        }
    }
    else {
        const dir_files = fs.readdirSync(current_path);

        dir_files.map(file => {
            mapping(current_path, file);
        });
    }
}

function save(uuid, copy_path, date, file_type){
    const year = getYear(date);
    const folder_name = year + ". year";
    const folder_path = path.join(new_path, folder_name);

    if(!fs.existsSync(folder_path)){
        fs.mkdirSync(folder_path);
    }

    fs.copyFile(copy_path, folder_path + "/" + uuid + "." + file_type, () => {});
}

function getYear(date){
    return date.substring(0, 4);
}