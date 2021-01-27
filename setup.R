# Unemployment Rate Dashboard  Support functions
# Adam Bickford January 2020
# 

library(tidyverse, quietly=TRUE)
library(stringr)
library(readr)
library(readxl, quietly=TRUE)
library(RPostgreSQL)
library(blsAPI)
library(plotly)
library(scales, quietly=TRUE)
library(shiny, quietly=TRUE)
library(shinydashboard, quietly=TRUE)
library(shinyjs, quietly=TRUE)
library(RColorBrewer)


# Additions for Database pool
library('pool') 
library('DBI')
library('stringr')
library('config')

# Set up database pool 
config <- get("database")
DOLAPool <-  dbPool(
  drv <- dbDriver(config$Driver),
  dbname = config$Database,
  host = config$Server,
  port = config$Port,
  user = config$UID,
  password = config$PWD
)



onStop(function(){
  poolClose(DOLAPool)
})


# Support Functions
# NumFmt formats a numberic variable to a whold number, comma separated value
#
NumFmt <- function(inval){
  outval <- format(round(inval ,digits=0),  big.mark=",")
  return(outval)
}

# Percent returns a percentage value
percent <- function(x, digits = 1, format = "f", ...) {
  paste0(formatC( x, format = format, digits = digits, ...), "%")
}

# simpleCap produces string in Proper case
simpleCap <- function(x) {
  s <- strsplit(x, " ")[[1]]
  paste(toupper(substring(s, 1,1)), tolower(substring(s, 2)),
        sep="", collapse=" ")
}

#YrSelect  Generates the selections for the type dropdown
typSelect <- function() {
   curYR <- as.integer(format(Sys.Date(), "%Y"))
   curMO <- as.integer(format(Sys.Date(), "%m"))
   if (curMO <= 2) {
     endYR <- curYR - 1
   } else{
     endYR <- curYR
   }
   startYR <- endYR - 7
   
   str5 <- paste0("Past Five Years (", startYR," to ",endYR - 2,")")
   strGR <- "Prior Unemployment Peak (2009 to 2012)"
   
   outList <- c(str5, strGR)
   
return(outList)   
}
    
# popPlace list of county names
popPlace <- function(DBPool) {
 

  # Create Connection Strings
  clookupStr <- paste0("SELECT DISTINCT countyfips, municipalityname FROM estimates.county_muni_timeseries WHERE placefips = 0;")

    # f.cLookup contains the county records
    f.cLookup <- dbGetQuery(DBPool, clookupStr)
    
 # Counties   
    f.cLookup <- arrange(f.cLookup, countyfips)
    f.cLookup[,2] <- sapply(f.cLookup[,2], function(x) simpleCap(x))
    f.cLookup$municipalityname <- str_replace(f.cLookup$municipalityname,"Colorado State","Colorado")
    
   
  return(f.cLookup)
}

#listToFips retuns a fips code from a county name

listTofips <- function(df, inList1){
  # Function to produce a vector of FIPS codes from an input list of names and codes
  fipsl <- df[which(df$municipalityname == inList1),1]
  return(fipsl)
} #end listTofips

# Substring Right
substrRight <- function(x, n){
  substr(x, nchar(x)-n+1, nchar(x))
}


# genBLSData  returns the analysis dataset, through the BLS API...
genBLSData <- function(fips, type){

  # Creating SeriesID List
  if(fips == 0) {
       seriesID <-  c("LAUST080000000000003", "LAUCA082160000000005")
  } else {
    ui <- paste0("LAUCN08",str_pad(fips,3,pad="0"),  "0000000003")
    nemp <- paste0("LAUCN08",str_pad(fips,3,pad="0"),  "0000000005")
    seriesID = c(ui,  nemp)
  }

# Creating Year Values
  curYR <- as.integer(format(Sys.Date(), "%Y"))
  curMO <- as.integer(format(Sys.Date(), "%m"))
  curDay <- as.integer(format(Sys.Date(),"%d"))
  if (curMO <= 3){
      endYR <- curYR - 1
    } else {
      endYR <- curYR
    }
  
  prevYR <- endYR - 1
  endRYR <- endYR - 2
  startRYR <- endYR - 7
  
  if(type == "Prior Unemployment Peak (2009 to 2012)") {
    endRYR <- 2012
    startRYR <- 2009
  }
  yrList <- c(endYR, prevYR,  startRYR, endRYR)
  
  # BLS API Call
  payload <- list(
    'seriesid' = seriesID,
    'startyear' = startRYR,
    'endyear' = endYR,
    "registrationkey" = "3f082b93fd55405f913441246a798750")
  
  f.BLS <- blsAPI(payload = payload, api_version = 2, return_data_frame =TRUE) %>% 
    mutate(type = substrRight(seriesID,1),
           value = as.numeric(as.character(value))) %>%
    filter(year %in% c(endYR, prevYR, startRYR:endRYR)) %>%
    arrange(type, year, period)
  
  # f.curData contains the UI and employment Numbers for the current year line and text boxes
  
  f.curUI <- f.BLS %>% filter(type == 3) %>% filter(year == endYR) %>%
    mutate(curUI = value/100) %>%
    select(periodName, curUI)
  
  f.curEMP <- f.BLS %>% filter(type == 5) %>% filter(year %in% c(endYR, prevYR)) %>%
    select(year, periodName, value) %>%
    spread(year, value) 
  
  f.curEMP[is.na(f.curEMP)] <- 0 
  names(f.curEMP) <- c("periodName", "prevYR", "curYR")
  f.curEMP$diff <- f.curEMP$curYR -  f.curEMP$prevYR
  
  f.curData <- inner_join(f.curUI, f.curEMP, by="periodName")
  
  
  # f.prevData contains the UI for the previous year line
  
  f.prevData <- f.BLS %>% filter(type == 3) %>% filter(year == prevYR) %>%
    mutate(prevUI = value/100) %>%
    select(periodName, prevUI)
  
  
  # f.ribbonData Contains the values for the ribbon 
  f.ribbonData <- f.BLS %>% filter(type == 3) %>% filter(year %in% startRYR:endRYR) %>%
    mutate(ui = value/100) %>%
    select(period, periodName, ui) %>%
    group_by(period, periodName) %>%
    summarize(minUI = min(ui,na.rm = TRUE),
              maxUI = max(ui,na.rm=TRUE)) %>%
    mutate(midUI = (minUI + maxUI)/2)
  
  
  f.allData <- inner_join(f.ribbonData, f.prevData, by="periodName") %>%
    full_join(., f.curData, by= "periodName")
 
  
  # Assembling output data object
  outList <- list("data" = f.allData,"years" = yrList)
  
return(outList)
}

# GenPlot returns the Plots
GenPlot <- function(ctyfips, ctyname, dattype) {

ctysel <- listTofips(ctyfips,ctyname)
f.outdata <- genBLSData(fips = ctysel,type = dattype)

f.chartData <- as.data.frame(f.outdata$data)

titleSTR <- paste0("Unemployment Rate: ",ctyname)

f.chartData$periodName <- factor(f.chartData$periodName, 
                                 levels = c("January", "February", "March","April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"))
f.chartDataout <- f.chartData %>%
    select(periodName:diff)



# legend entries and caption
curSTR <- paste0("Unemployment Rate: ", f.outdata$years[1])
prevSTR  <- paste0("Unemployment Rate: ", f.outdata$years[2])
midSTR <- paste0("Midpoint of Unemployment Rate, ",f.outdata$years[3], "-", f.outdata$years[4])
rngSTR <- paste0("Range of Unemployment Rate, ",f.outdata$years[3], "-", f.outdata$years[4])

captionSTR <- paste0("Data: Bureau of Labor Statistics API - Data not Seasonally Adjusted.<br>BLS.gov cannot vouch for the data or analyses derived from these data<br>after the data have been retrieved from BLS.gov.",
                     "<br>Visualization by the State Demography Office, Print Date: ", format(Sys.Date(), "%m/%d/%Y"))

# tool tip text
f.chartData$maxText <- paste0("Maximum Unemployment Rate: ",percent(f.chartData$maxUI*100), "<br>", f.chartData$periodName, ", ",f.outdata$years[3], "-", f.outdata$years[4])
f.chartData$minText <- paste0("Minimum Unemployment Rate: ",percent(f.chartData$minUI*100), "<br>",  f.chartData$periodName, ", ",f.outdata$years[3], "-", f.outdata$years[4])
f.chartData$midText <- paste0("Midpoint of Unemployment Rate: ",percent(f.chartData$midUI*100),"<br>", f.chartData$periodName, ", ",f.outdata$years[3], "-", f.outdata$years[4])
f.chartData$prevText <- paste0("Unemployment Rate: ",percent(f.chartData$prevUI*100), "<br>", f.chartData$periodName, ", ",f.outdata$years[2])
f.chartData$curText <- paste0("Unemployment Rate: ",percent(f.chartData$curUI*100), "<br>", f.chartData$periodName, ", ",f.outdata$years[1], "<br>",
                               "Number Employed ",f.chartData$periodName, ", ",f.outdata$years[1],": ",NumFmt(f.chartData$curYR), "<br>",
                               "Number Employed ",f.chartData$periodName, ", ",f.outdata$years[2],": ",NumFmt(f.chartData$prevYR), "<br>",
                               "Difference: ",NumFmt(f.chartData$diff))

# Chart Title
total_tit <- paste0("Unemployment Rate ",ctyname)
fig <- plot_ly(f.chartData, x = ~periodName, y = ~maxUI, type = 'scatter', mode = 'lines+markers',
               line = list(color = 'rgba(0,0,255,1)'),
               name = rngSTR, text = ~maxText, hoverinfo = 'text') %>% 
              config( toImageButtonOptions = list(format = "png", filename = total_tit,
                                                  width = 1450, height = 500))
fig <- fig %>% add_trace(y = ~minUI, type = 'scatter', mode = 'lines+markers',
                         fill = 'tonexty', fillcolor='rgba(173,216,230,0.4)', line = list(color = 'rgba(0,0,255,1)'),
                         marker = list(color = 'rgba(0,0,255,1)'),
                         showlegend = FALSE, name = rngSTR, text = ~minText, hoverinfo = 'text')
fig <- fig %>% add_trace(y = ~midUI, type = 'scatter', mode = 'lines+markers',
                         line = list(color = 'rgba(0,0,0,1)'),
                         marker = list(color = 'rgba(0,0,0,1)'),
                         name = midSTR, text = ~midText, hoverinfo = 'text')
fig <- fig %>% add_trace(y=~prevUI, type = 'scatter', mode = 'lines+markers',
                         line = list(color = 'rgba(165,42,42,1)'),
                         marker = list(color = 'rgba(165,42,42,1)'),
                         name = prevSTR, text = ~prevText, hoverinfo = 'text')
fig <- fig %>% add_trace(y=~curUI, type = 'scatter', mode = 'lines+markers',
                         line = list(color = 'rgba(255,0,0,1)'),
                         marker = list(color = 'rgba(255,0,0,1)'),
                         name = curSTR, text = ~curText, hoverinfo = 'text')

fig <- fig %>% layout(autosize = T,
                      title = titleSTR,
                      paper_bgcolor='rgb(255,255,255)', plot_bgcolor='rgb(229,229,229)',
                      hoverlabel = "right",
                      xaxis = list(title = "Months",
                                   gridcolor = 'rgb(255,255,255)',
                                   showgrid = TRUE,
                                   showline = FALSE,
                                   showticklabels = TRUE,
                                   tickcolor = 'rgb(127,127,127)',
                                   ticks = 'outside',
                                   zeroline = FALSE),
                      yaxis = list(title = "Unemployment Rate",
                                   gridcolor = 'rgb(255,255,255)',
                                   showgrid = TRUE,
                                   showline = FALSE,
                                   showticklabels = TRUE,
                                   tickformat = "%",
                                   tickcolor = 'rgb(127,127,127)',
                                   ticks = 'outside',
                                   zeroline = FALSE),
                      annotations = list(text=captionSTR, xref = 'paper', x = 1.3,
                                         yref = 'paper', y = 0.05,
                                         align='left', showarrow=FALSE,
                                         font=list(size=10)))

#Final Formatting of  f.chartDataOUt

f.chartDataout[,2:6] <- sapply(f.chartDataout[,2:6],function(x) percent(x* 100))
f.chartDataout[,2:6] <- sapply(f.chartDataout[,2:6],function(x) sub("NA%","",x))
f.chartDataout[,7:9] <- sapply(f.chartDataout[,7:9],function(x) NumFmt(x))
f.chartDataout[,7:9] <- sapply(f.chartDataout[,7:9],function(x) sub("NA","",x))

 


minSTR <- paste0("Minimum Unemployment Rate, ",f.outdata$years[3], "-", f.outdata$years[4])
maxSTR <- paste0("Maximum Unrmployment Rate: ",f.outdata$years[3], "-", f.outdata$years[4])
prevEMPSTR <- paste0("Number Employed ",f.outdata$years[2])
curEMPSTR <- paste0("Number Employed ",f.outdata$years[1])

names(f.chartDataout) <- c("Month", minSTR,maxSTR,midSTR,prevSTR,curSTR,prevEMPSTR,curEMPSTR,"Difference")

outlist <- list("LINE" = fig, "CHDATA" = f.chartDataout)
return(outlist)
}


