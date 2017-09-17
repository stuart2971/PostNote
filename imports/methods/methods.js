import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { withRouter, Redirect } from "react-router-dom";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import cloudinary from "cloudinary";


export const Notes = new Mongo.Collection("notes");

if(Meteor.isServer){
  Meteor.publish('notes', function () {
    return Notes.find()
  });
  Meteor.publish('users', function () {
    return Meteor.users.find()
  });
  Meteor.publish('notes-newest', function () {
    return Notes.find({}, {sort: {createdAt: -1}, limit: 10});
  });

  Meteor.methods({
    "cloudinary.remove"(public_id){
      cloudinary.config({
        cloud_name: "djomgi4gv",
        api_key: "978536488113234",
        api_secret: "hd6-RkQK2MDEK1ovSgZEwLifTqY"
      })
      cloudinary.uploader.destroy(public_id, function(error, result){console.log(result)});
    }
  });
}

Meteor.methods({
  "notes.insert"(noteInfo){
    noteInfo.imageURL.map((url) => {
      const URLSchema = new SimpleSchema({
        imageURL:{
            type:String,
            label:"Your image URL",
            regEx: SimpleSchema.RegEx.Url
        }
      }).validate({ imageURL:url })
    })

    Notes.insert({
      title: noteInfo.title,
      subject: noteInfo.subject,
      description: noteInfo.description,
      imageURL: noteInfo.imageURL,
      userId: noteInfo.userId,
      userEmail: noteInfo.userEmail,
      unit: noteInfo.unit,
      likes: [],
      dislikes: [],
      createdAt: noteInfo.createdAt,
      cloudinaryData: noteInfo.cloudinaryData
    })
    console.log("Note Inserted", noteInfo)
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
 },
 "notes.remove"(id){
    Notes.remove(id)
 }
})
