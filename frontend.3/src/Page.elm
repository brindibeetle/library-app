module Page exposing (..)

type Page
    = Landing
    | BookSelectorPage 
    | LoginPage
    | BookSelectorDetailPage


toString : Page -> String
toString page =
    case page of
        Landing ->
            "NotFoundPage"

        BookSelectorPage ->
            "BookSelectorPage"

        LoginPage ->
            "LoginPage"

        BookSelectorDetailPage ->
            "BookSelectorDetailPage"
    