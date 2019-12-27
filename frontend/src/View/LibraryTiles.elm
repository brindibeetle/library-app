module View.LibraryTiles exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Array exposing (Array)
import Dict

import RemoteData exposing (WebData)

import Utils exposing (buildErrorMessage)

import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Select as Select
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Spinner as Spinner
import Bootstrap.Card.Block as Block

import Domain.Checkout exposing (..)
import Domain.Book exposing (..)
import Utils exposing (..)

import Css exposing (..)


-- #####
-- #####   VIEW
-- #####


type alias Config msg a =
    { userEmail : String

    , searchTitle : String 
    , searchAuthors : String 
    , searchLocation : String 
    , searchOwner : String 
    , searchCheckStatus : String 
    , searchCheckoutUser : String

    , updateSearchTitle :  String -> msg 
    , updateSearchAuthors :  String -> msg 
    , updateSearchLocation :  String -> msg 
    , updateSearchOwner :  String -> msg 
    , updateSearchCheckStatus :  String -> msg 
    , updateSearchCheckoutUser :  String -> msg 

    , showSearchTitle : Bool
    , showSearchAuthors : Bool
    , showSearchLocation : Bool
    , showSearchOwner : Bool
    , showSearchCheckStatus : Bool
    , showSearchCheckoutUser : Bool

    , doSearch : msg
    , doAction : Int -> msg
    , books : WebData (Array (Book a)) 
    , checkouts : WebData (Array (Maybe Checkout)) 
    }

-- view : WebData (Array (Book a)) -> WebData (Array (Maybe Checkout)) ->  Html Msg
view : Config msg a -> Html msg
view config =
    div [ class "row containerFluid"]
        [ div [ class "col-lg-2 col-md-3 mb-4" ]
            [ viewBookFilter config ]
        , div [ class "col-lg-8" ]
            [ viewBooks config ]
        ]


viewBookFilter : Config msg a -> Html msg
viewBookFilter config =
    let
        { books, doSearch } = config

    in
        div [ class "container" ]
            [
                Form.form []
                [ 
                    Form.group []
                        [ Form.label [ ] [ text "Title"]
                        , Input.text [ Input.small, Input.value config.searchTitle, Input.onInput (config.updateSearchTitle) ]
                        ]
                    , Form.group []
                        [ Form.label [ ] [ text "Author(s)"]
                        , Input.text [  Input.small,Input.value config.searchAuthors, Input.onInput (config.updateSearchAuthors)   ]
                        ]
                    , Form.group []
                        [ Form.label [ ] [ text "Location"]
                        , Select.select [ Select.onChange config.updateSearchLocation
                            ]
                            ( List.map (selectitem config.searchLocation) (("","") :: getLocations books) )
                        ]
                    , Form.group []
                        [ Form.label [ ] [ text "Owner"]
                        , Select.select [ Select.onChange config.updateSearchOwner
                            ]
                            ( List.map (selectitem config.searchOwner) (("","") :: getOwners books) )
                        ]
                    , Form.group []
                        [ Form.label [ ] [ text "Availability"]
                        , Select.select [ Select.onChange config.updateSearchCheckStatus
                            ]
                            ( List.map (selectitem config.searchCheckStatus) (("","") :: Dict.toList checkedStatusList) )
                        ]
                    , Form.group []
                        [ Form.label [ ] [ text "Checked out by"]
                        , Select.select [ Select.onChange config.updateSearchCheckoutUser
                            ]
                            ( List.map (selectitem config.searchCheckoutUser) (("","") :: getCheckoutUsers config.checkouts ) )
                        ]
                    -- , Button.button
                    --     [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick doSearch ]
                    --     [ text "Filter" ]
                ]
            ]




viewFetchError : String -> Html msg
viewFetchError errorMessage =
    let
        errorHeading =
            "Couldn't fetch posts at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ errorMessage)
        ]

merge2RemoteDatas :
    RemoteData.RemoteData e a
    -> RemoteData.RemoteData e b
    -> RemoteData.RemoteData e ( a, b)
merge2RemoteDatas a b = 
        RemoteData.map (\a1 b1 -> ( a1, b1 )) a
            |> RemoteData.andMap b

-- viewBooks : msg -> WebData (Array (Book a)) -> WebData (Array (Maybe Checkout)) -> Html msg
-- viewBooks doSearch books checkoutsCorresponding =
viewBooks : Config msg a -> Html msg
viewBooks config =
    let
        { books, checkouts, doSearch } = config

        waarzijnwe = Debug.log "Library.elm viewBooks libraryBooks " books
        -- waarzijnwe1 = Debug.log "Library.elm viewBooks checkoutsCorresponding " checkouts

        books_checkouts = merge2RemoteDatas books checkouts
        
    in
    case books_checkouts of
        RemoteData.NotAsked ->
            div [ class "container" ] 
                [ p [] [ br [] [] ]
                ]

        RemoteData.Loading ->
            div [ class "container" ]
                [ Spinner.spinner
                    [ Spinner.large
                    , Spinner.color Text.primary
                    ]
                    [ Spinner.srMessage "Loading..." ]
                ]

        RemoteData.Success ( actualBooks, actualCheckouts ) ->
            div [ class "containerFluid" ]
                [ viewBookTiles config actualBooks actualCheckouts ]
                
        RemoteData.Failure httpError ->
            div [ class "container" ]
                [ viewFetchError (buildErrorMessage httpError) 
                ]

        
viewBookTiles : Config msg a -> Array (Book a) -> Array (Maybe Checkout) -> Html msg
viewBookTiles config books checkouts =
    List.range 0 (Array.length books - 1)
        |> List.map3 bookCheckoutIndex (Array.toList books) (Array.toList checkouts)
        |> List.filterMap
            ( booksFilter 
                        { searchTitle = config.searchTitle
                        , searchAuthors = config.searchAuthors
                        , searchOwner = config.searchOwner
                        , searchLocation = config.searchLocation
                        , searchCheckStatus = config.searchCheckStatus
                        , searchCheckoutUser = config.searchCheckoutUser
                        }
            )
        |> List.map (viewBookTilesCard config)
        |> div [ class "row"  ]


-- "http://books.google.com/books/content?id=qR_NAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
-- zoom=1 -> zoom=10 for better resolution
getthumbnail : (Book a) -> String
getthumbnail book =
    String.replace "&zoom=1&" "&zoom=7&" book.thumbnail


viewBookTilesCard : Config msg a -> { book : (Book a) , checkout : Maybe Checkout , index : Int } -> Html msg
viewBookTilesCard { doAction, userEmail } { book, checkout, index } =
    case checkout of
        Just checkout1 ->
            if ( userEmail == checkout1.userEmail) then
                div [ class "col-lg-3 col-md-4 mb-4", onClick (doAction index) ]
                    [ 
                        Card.config [ Card.attrs [ class "card-checkout-x" ] ]
                            |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                            |> Card.block [ ] 
                                [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                                , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                                , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                                , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                                , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                                , Block.text [ class "text-checkout-x" ] 
                                        [ p [] [ text "Checked out!" ]
                                        , p [ class "small" ] [ text ("from " ++ getNiceTime checkout1.dateTimeFrom ++ ", by You" ) ]
                                        ]
                                ]
                            |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                            |> Card.view
                    ]
            else
                    div [ class "col-lg-3 col-md-4 mb-4", onClick (doAction index) ]
                    [ 
                        Card.config [ Card.attrs [ class "card-checkout" ] ]
                            |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                            |> Card.block [ ] 
                                [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                                , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                                , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                                , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                                , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                                , Block.text [ class "text-checkout" ] 
                                        [ p [] [ text "Checked out!" ]
                                        , p [ class "small" ] [ text ("from " ++ getNiceTime checkout1.dateTimeFrom ++ ", by " ++ checkout1.userEmail ) ]
                                        ]
                                ]
                            |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                            |> Card.view
                    ]

        Nothing ->
            div [ class "col-lg-3 col-md-4 mb-4", onClick (doAction index) ]
            -- div [ class "col-lg-4 col-md-6 mb-4", onClick (doAction index) ]
                [ 
                    Card.config [ Card.attrs [] ]
                        |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                        |> Card.block [ ] 
                            [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                            , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                            , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                            , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                            , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                            ]
                        |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                        |> Card.view
                ]

        

-- #####
-- #####   UTILITY
-- #####


setSearchTitle : String -> Config msg a -> Config msg a
setSearchTitle title config =
    { config | searchTitle = title }

setSearchAuthors : String -> Config msg a -> Config msg a
setSearchAuthors authors config =
    { config | searchAuthors = authors }


setSearchLocation : String -> Config msg a -> Config msg a
setSearchLocation location config =
    { config | searchLocation = location }


setSearchOwner : String -> Config msg a -> Config msg a
setSearchOwner owner config =
    { config | searchOwner = owner }


setCheckStatus : String -> Config msg a -> Config msg a
setCheckStatus status config =
    { config | searchCheckStatus = status }


setCheckoutUser : String -> Config msg a -> Config msg a
setCheckoutUser user config =
    { config | searchCheckoutUser = user }
 


getLocations : WebData (Array (Book a)) -> List ( String, String )
getLocations webDataBooks =
    case webDataBooks of
        RemoteData.Success actualBooks ->
            List.foldl addLocation [] (Array.toList actualBooks)
            
        _ ->
            []

addLocation : Book a -> List (String, String) -> List (String, String)
addLocation book locations =
    if book.location == "" then
        locations
    else
        if List.member ( book.location, book.location ) locations then
            locations
        else
            ( book.location, book.location ) :: locations


getOwners : WebData (Array (Book a)) -> List ( String, String )
getOwners webDataBooks =
    case webDataBooks of
        RemoteData.Success actualBooks ->
            List.foldl addOwner [] (Array.toList actualBooks)
            
        _ ->
            []

addOwner : Book a -> List (String, String) -> List (String, String)
addOwner book owners =
    if book.owner == "" then
        owners
    else
        if List.member (book.owner, book.owner) owners then
            owners
        else
            ( book.owner, book.owner ) :: owners

getCheckoutUsers : WebData (Array (Maybe Checkout)) -> List ( String, String )
getCheckoutUsers webDataCheckouts =
    case webDataCheckouts of
        RemoteData.Success actualCheckouts ->
            Array.toList actualCheckouts
            |> List.foldl addCheckoutUser []
            
        _ ->
            []

addCheckoutUser : Maybe Checkout -> List (String, String) -> List (String, String)
addCheckoutUser maybeCheckout users =
    case maybeCheckout of
        Just checkout ->
            if checkout.userEmail == "" then
                users
            else
                if List.member (checkout.userEmail, checkout.userEmail) users then
                    users
                else
                    ( checkout.userEmail, checkout.userEmail ) :: users

        Nothing ->
            users



selectitem : (String) -> (String, String) -> Select.Item msg
selectitem valueSelected (value1, text1) =
    case valueSelected == value1 of
        True ->
            Select.item [ selected True, value value1 ] [ text text1 ] 

        False ->
            Select.item [ value value1 ] [ text text1 ] 



booksFilter : 
    { searchTitle : String, searchAuthors : String, searchOwner : String, searchLocation : String, searchCheckStatus : String, searchCheckoutUser : String } 
    -> { book: Book a, checkout: Maybe Checkout, index: Int } 
    -> Maybe { book: Book a, checkout: Maybe Checkout, index: Int }
booksFilter 
    { searchTitle, searchAuthors, searchOwner, searchLocation, searchCheckStatus, searchCheckoutUser } 
    { book, checkout, index } =
    if
        ( String.isEmpty searchTitle || String.contains (String.toUpper searchTitle) (String.toUpper book.title) )
        && ( String.isEmpty searchAuthors || String.contains (String.toUpper searchAuthors) (String.toUpper book.authors) )
        && ( String.isEmpty searchOwner || searchOwner == book.owner) 
        && ( String.isEmpty searchLocation || searchOwner == book.location) 
        && ( String.isEmpty searchCheckStatus 
            || ( searchCheckStatus == "available" && checkout == Nothing )
            || ( searchCheckStatus == "checkedout" && checkout /= Nothing )
        )
        && ( String.isEmpty searchCheckoutUser 
            || case checkout of
                Just checkout1 ->
                    checkout1.userEmail == searchCheckoutUser
            
                Nothing ->
                    False
        )
    then
        Just { book = book, checkout = checkout, index = index }
    else
        Nothing


bookCheckoutIndex : Book a -> Maybe Checkout -> Int -> { book: Book a, checkout: Maybe Checkout, index: Int }
bookCheckoutIndex book checkout index =
    { book = book, checkout = checkout, index = index }