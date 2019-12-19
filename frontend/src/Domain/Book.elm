module Domain.Book exposing (Book)

import Domain.Checkout exposing (Checkout)

-- extensible record
type alias Book a =
    { a 
    | title : String
    , authors : String
    , description : String
    , publishedDate : String
    , language : String
    , smallThumbnail : String
    , thumbnail : String
    , owner : String
    , location : String
    , checkout : Maybe Checkout
    }
