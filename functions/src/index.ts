import * as functions from 'firebase-functions';

const euWest2 = functions.region('europe-west2');

export const helloWorld = euWest2.https.onRequest((request, response) => {
    response.send('helloWorld');   
});

//export const updateCompanies = euWest2.pubsub.schedule('* * * * *').onRun(context => {
//    return null;
//});

console.log('hej');