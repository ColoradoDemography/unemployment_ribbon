# Unemployment Analysis Dashboard
# Adam Bickford January 2021
# This program will pull current unemployment rate and labor force data from the BLS API
# and produce a plotly chart that shows three monthly data series for a selected county.
# 
library(plotly)
library(shiny)

source("setup.R")

  ctylist  <- popPlace(DOLAPool)
  typeList <- typSelect()


function(req) {
  htmlTemplate("index.html",
                county=selectInput("county","Select a county:", choices= ctylist[,2]),  # Build this from data set
                type=selectInput("type","Ribbon Type:",choices= typeList), # Build this from data set
                goBtn = actionButton("goButton","Generate Chart"),
                line_chart = plotlyOutput("LINE"),
                dlBtn = downloadButton("CHDATA","Download Data (CSV)"))
 }



 
