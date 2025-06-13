import HashIds from "hashids";


let hashIds: HashIds | undefined = undefined;

if (!hashIds) {
    hashIds = new HashIds(process.env.HASH_SALT as string);
}

export { hashIds }