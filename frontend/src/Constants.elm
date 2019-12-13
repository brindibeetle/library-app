module Constants exposing (..)

libraryApiBaseUrl : String
libraryApiBaseUrl = "http://localhost:8080/api/v1"


languages : List (String, String)
languages = [ ("",""), ("en", "English"), ("nl", "Nederlands"), ("fr", "Français") ]

locations : List (String, String)
locations = [ ("", ""), ("am", "Amsterdam"), ("ro", "Rotterdam"), ("br", "Bruxelles"), ("ch", "Chessy") ]

