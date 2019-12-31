module Welcome exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import RemoteData exposing (RemoteData, WebData, succeed)

import Utils exposing (buildErrorMessage)
import Session exposing (..)
import Domain.User exposing (..)

type Msg = ChangedPage Page


view : Session -> Html Msg
view session =
    case ( session.token, session.user, session.userInfo ) of
        ( Nothing, _, _ ) ->
             div [ class "container" ]
                [ h1 [] [ text "Welcome" ]
                , p [] 
                    [ text "Welcome to the Lunatech's Library App."
                    , br [] []
                    , text "Browse interesting books. Books that you can borrow from your colleagues."
                    ]
                , p [] 
                    [ text "And maybe you have some books at home that are interesting for others..."
                    , br [] []
                    , div [ onClick (ChangedPage LoginPage), class "linktext"  ] [ text "Please login and take a look." ] 
                    ]
                ]

        ( Just token, RemoteData.Success user, RemoteData.Success userInfo ) ->
             div [ class "container" ]
                [ h1 [] [ text ("Welcome") ]
                , p [] 
                    [ text ("Hi " ++ user.name ++ ", welcome to the Lunatech's Library App.")
                    , br [] []
                    , if userInfo.numberCheckouts > 0 then 
                        div [] 
                        [ div [ onClick (ChangedPage CheckinPage), class "linktext"  ] 
                            [ text ("You have checked out " ++ (String.fromInt userInfo.numberCheckouts) ++ "  books. Now you can return these books to the library." ) ]
                        , div [ onClick (ChangedPage LibraryPage), class "linktext"  ] 
                            [ text ("Or browse for more interesting books in the library." ) ]
                        ]
                      else
                        div [ onClick (ChangedPage LibraryPage), class "linktext"  ] 
                            [ text "Now you can browse interesting books in the library. Books that you can borrow from your colleagues." ]

                    ]
                , p [] 
                    [ if userInfo.numberBooks > 0 then 
                        div []
                        [ div [ onClick (ChangedPage BookEditorPage), class "linktext"  ] 
                            [ text ("You have registered " ++ (String.fromInt userInfo.numberBooks) ++ " books in the library. Now you can manage these books." ) ]
                        , div [ onClick (ChangedPage BookSelectorPage), class "linktext"  ] 
                            [ text ("Or add some more interesting books.") ]
                        ]
                      else
                        div []
                        [ div [ onClick (ChangedPage BookSelectorPage), class "linktext"  ] 
                            [ text ("Or add some books to the library that are interesting for others..." )]
                        ]
                    ]
                , case session.message of
                    Session.Succeeded message ->
                        p [ class "text-success" ] 
                        [ div [] [ text  message ] ]
            
                    Session.Warning message ->
                        p [ class "text-warning" ] 
                        [ div [] [ text message ] ]

                    Session.Error message ->
                        p [ class "text-danger" ] 
                        [ div [] [ text message ] ]

                    Session.Empty ->
                        p []
                        []

                ]

        ( Just token, RemoteData.Failure httpError, _ ) ->
            div [ class "container" ]
                [ p [ class "text-danger" ] [ text (buildErrorMessage httpError) ] ]

        ( Just token, _, RemoteData.Failure httpError ) ->
            div [ class "container" ]
                [ p [ class "text-danger" ] [ text (buildErrorMessage httpError) ] ]

        ( _ , _, _ ) ->
            div [ class "container" ]
                [ p [ class "text-danger" ] [ text "Something went wrong here." ] ]


update : Msg -> Session -> ( Session, Cmd Msg )
update msg session =
    
    case msg of
        ChangedPage page ->
            ( changedPageSession page session, Cmd.none )

