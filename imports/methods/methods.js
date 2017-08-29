import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { withRouter, Redirect } from "react-router-dom";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Notes = new Mongo.Collection("notes");

if(Meteor.isServer){
  Meteor.publish('notes', function () {
    return Notes.find()
  });
  Meteor.publish('users', function () {
    return Meteor.users.find()
  });
  Meteor.publish("user", function(){
    return Meteor.user()
  })
}

Meteor.methods({
  "notes.insert"(noteInfo){
    const URLSchema = new SimpleSchema({
      imageURL:{
          type:String,
          label:"Your image URL",
          regEx: SimpleSchema.RegEx.Url
      }
    }).validate({ imageURL:noteInfo.imageURL })
    Notes.insert({
      title: noteInfo.title,
      subject: noteInfo.subject,
      description: noteInfo.description,
      imageURL: noteInfo.imageURL,
      userId: noteInfo.userId,
      userEmail: noteInfo.userEmail,
      likes: [],
      dislikes: []
    })
    console.log("Note Inserted", )
  },
  "like"(noteId, userEmail){
    const notes = Notes.findOne( noteId ).likes;
    if(!notes.includes(userEmail)){
      Notes.update({
        _id: noteId
      }, {
        $push:{
          likes: userEmail
        }
     });
   }else{
     throw new Meteor.Error(400, "You already liked this note")
   }
   return notes.length
  },
  "dislike"(noteId, userEmail){
    const notes = Notes.findOne( noteId ).dislikes;
    if(!notes.includes(userEmail)){
      Notes.update({
        _id: noteId
      }, {
        $push:{
          dislikes: userEmail
        }
     });
     console.log(notes)
   }else{
     throw new Meteor.Error(400, "You already Disliked this note")
   }
   return notes.length
  }
})
