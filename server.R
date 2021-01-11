source("setup.R")

function(input, output, session) {

observeEvent( input$goButton,{
    cty <- popPlace(DOLAPool)
    selcty <- input$county
    seltype<- input$type
    OutPlot <- GenPlot(ctyfips=cty, ctyname= selcty, dattype= seltype)

#OutData <- genData(DBPool=DOLAPool,ctyfips=ctylist, ctyname= input$county, datyear= year)

output$LINE <-  renderPlotly({OutPlot[["LINE"]]})

# Add Download Image...

output$CHDATA=downloadHandler(
    filename= function(){
      paste0("BLS Unemployment Data",selcty,".csv")
    },
    content= function(file){
      write.csv(OutPlot[["CHDATA"]], file, row.names=FALSE)
    }
 )
})
}
