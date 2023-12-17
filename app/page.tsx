'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import { EditTextarea } from 'react-edit-text'
import 'react-edit-text/dist/index.css'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import {pdfjs, Document, Page } from 'react-pdf'
import "react-pdf/dist/esm/Page/TextLayer.css"
import { teal, purple, blueGrey } from '@mui/material/colors'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const style = {
  color: 'black',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const style2 = {
  color: 'black',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'darkslategray',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const defaultButtonTable = [
  Array(5).fill("100"),
  Array(5).fill("200"),
  Array(5).fill("300"),
  Array(5).fill("400"),
  Array(5).fill("500"),
]

const defaultWinnerTable = [
  Array(5).fill("none"),
  Array(5).fill("none"),
  Array(5).fill("none"),
  Array(5).fill("none"),
  Array(5).fill("none"),
]

export default function Home() {

  const [selRow, setSelRow] = React.useState<number>(0);
  const [selCol, setSelCol] = React.useState<number>(0);

  const [pdfFile, setPdfFile]=React.useState<ArrayBuffer|string|null>(null);
  const [pdfFileError, setPdfFileError]=React.useState('');
  const [viewPdf, setViewPdf]=React.useState<ArrayBuffer|string|null>(null);

  const fileType=['application/pdf'];

  const [buttonTable, setButtonTable] = React.useState(JSON.parse(JSON.stringify(defaultButtonTable)));
  const [winnerTable, setWinnerTable] = React.useState(JSON.parse(JSON.stringify(defaultWinnerTable)));
  const [leftScore, setLeftScore] = React.useState<number>(0);
  const [rightScore, setRightScore] = React.useState<number>(0);

  const [docButtonLabel, setDocButtonLabel] = React.useState("Show answer");

  const [open, setOpen] = React.useState(false)
  const [openFinal, setOpenFinal] = React.useState(false)
  const [openWarnReset, setOpenWarnReset] = React.useState(false)

  const [uploadPopup, setUploadPopup] = React.useState(false)
	const [pageNumber, setPageNumber] = React.useState(1)

  const [offset, setOffset] = React.useState(3)

  React.useEffect(() => {
    const unloadCallback = (event:any) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const getTeamColor = (team: any) : ("success" | "secondary" | "primary") => {
    if (team === "left") return "success"
    if (team === "right") return "secondary"
    return "primary"
  }

  const getToastPosition = (team:any) : ("bottom-left" | "bottom-center" | "bottom-right") => {
    if (team === "left") return "bottom-left"
    if (team === "right") return "bottom-right"
    return "bottom-center"
  }

  const getToastColor = (team:any) => {
    if (team === "left") return "#16624b"
    if (team === "right") return "#691c8a"
    return "grey"
  }

  const handleRadioSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tableCopy = JSON.parse(JSON.stringify(winnerTable))
    const value = event.target.value
    tableCopy[selRow][selCol] = value
    toast.dismiss()
    value !== "none" && toast('+' + (selRow * 100 + 100), {
      position: getToastPosition(value),
      style: {
        color: 'white',
        backgroundColor: getToastColor(value),
        fontSize: '30px'
      },
    })
    setWinnerTable(tableCopy)
    calculateScores(tableCopy)
  };

  const handleOffsetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOffset(Number(event.target.value))
  }

  const radioControlProps = (item: string) => ({
    checked: winnerTable[selRow][selCol] === item,
    onChange: handleRadioSelectChange,
    value: item,
    name: 'radio-button-team',
    inputProps: { 'aria-label': item },
  });

  const selectNumber = ({i,j}:{i:number,j:number}) => {
    console.log(offset+j*10+i*2+1)
    setSelRow(i)
    setSelCol(j)
    setPageNumber(offset+j*10+i*2+1)
    setDocButtonLabel("Show Answer")
    setOpen(true)
    buttonTable[i][j] = ""
  }
  const handleClose = () => setOpen(false)

  const resetRows = () => {
    setButtonTable(JSON.parse(JSON.stringify(defaultButtonTable)));
    setWinnerTable(JSON.parse(JSON.stringify(defaultWinnerTable)));
    setLeftScore(0)
    setRightScore(0)
    setOpenWarnReset(false)
  }

  const toggleDocButton = () => {
    if (pageNumber % 2 == 0) {
      setPageNumber(pageNumber - 1)
      setDocButtonLabel("Show Answer")
    } else {
      setPageNumber(pageNumber + 1)
      setDocButtonLabel("Show Question")
    }
  }

  const handlePdfFileChange=(e:any)=>{
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = (e) =>{
              e && e.target && setPdfFile(e.target.result);
              setPdfFileError('');
            }
      } else {
        setPdfFile(null);
        setPdfFileError('Please select valid pdf file');
      }
    } else {
      console.log('No file selected');
    }
  }
  
  const handlePdfFileSubmit = (e:any) =>{
    e.preventDefault()
    setViewPdf(pdfFile)
    pdfFile && toast.success("File Uploaded Successfully")
  }

  const calculateScores = (tableCopy:any) => {
    var leftScore = 0
    var rightScore = 0
    Array(5).fill(0).map((_, i) => {
      const score = (i + 1) * 100
      Array(5).fill(0).map((_, j) => {
        console.log(tableCopy[i][j])
        if (tableCopy[i][j] === "left") {
          leftScore += score
        } else if (tableCopy[i][j] === "right") {
          rightScore += score
        }
      })
    });
    setLeftScore(leftScore)
    setRightScore(rightScore)
  }

  const finalJeopardy = () => {
    setPageNumber(offset+51)
    setOpenFinal(true)
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div id="warn-reset">
        <Dialog open={openWarnReset}
          onClose={() => setOpenWarnReset(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{color: teal[600]}}>
          <DialogTitle id="alert-dialog-title"> Warning </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reset the game?
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              This will not clear any uploaded files or category names.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWarnReset(false)}>Cancel</Button>
            <Button onClick={resetRows} autoFocus color="warning"> Reset </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div id="jeopardy-card-modal">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Document file={viewPdf}>
              <Page pageNumber={pageNumber} 
                canvasBackground='transparent'
                renderAnnotationLayer={false} 
                renderTextLayer={false} />
            </Document>
            <Button onClick={toggleDocButton} variant="outlined">{docButtonLabel}</Button>
            <div className="radio-group">
            <Radio {...radioControlProps('left')} sx={{ color: teal[600],
                '&.Mui-checked': { color: teal[500],}}} />
            <Radio {...radioControlProps('none')} sx={{ color: blueGrey[600],
                '&.Mui-checked': { color: blueGrey[600],}}} />
            <Radio {...radioControlProps('right')} sx={{ color: purple[600],
                '&.Mui-checked': { color: purple[500],}}} />
            </div>
            
          </Box>
        </Modal>
      </div>
      <div id="final-jeopardy-card-modal">
        <Modal
          open={openFinal}
          onClose={() => setOpenFinal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Document file={viewPdf}>
              <Page pageNumber={pageNumber} 
                canvasBackground='transparent'
                renderAnnotationLayer={false} 
                renderTextLayer={false} />
            </Document>
            <div>
              <span id="final-jeopardy-left-score">{leftScore}</span>
              <Button onClick={() => setPageNumber(offset+51)} variant="outlined">
                TOPIC
              </Button>
              <Button onClick={() => setPageNumber(offset+52)} variant="outlined">
                QUESTION
              </Button>
              <Button onClick={() => setPageNumber(offset+53)} variant="outlined">
                ANSWER
              </Button>
              <span id="final-jeopardy-right-score">{rightScore}</span>
            </div>
          </Box>
        </Modal>
      </div>
      <div id="upload-file-modal">
        <Modal
          open={uploadPopup}
          onClose={() => setUploadPopup(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <form className='form-group' onSubmit={handlePdfFileSubmit}>
              <h2 id="settingHeader"> {viewPdf ? 'File Currently Loaded' : 'No File Loaded'} </h2><br/> 
              <div id="pageOffsetDiv" className='form-control' style={{width: '60%'}} >
                Page Offset:&nbsp;&nbsp;
                <input type="number" value={offset} onChange={handleOffsetChange} id="offset-num" name="offsetNum" />
              </div><br/><br/>
              <input type="file" className='form-control' required onChange={handlePdfFileChange}/>
              {pdfFileError && <div className='error-msg' > {pdfFileError} </div>}
              <br/><a target="_blank" 
                href="https://docs.google.com/presentation/d/1N_5IbXUY3y2PCuhFQ0YA7ZuREwC7ew1Q3fyILBnEBQA/edit#slide=id.p">
                Open Google Slides Template
              </a><br/><br/> 
              <button type="submit" className='upload-file-btn'>
                UPLOAD PDF
              </button>
            </form>
          </Box>
        </Modal>
      </div>
      <div className="scoreboard">
          <h1><span className="left-team-score">{leftScore}</span>&nbsp;|&nbsp;
          <span className="right-team-score">{rightScore}</span></h1>
      </div>
      <table><tbody>
        <tr>
          <th><EditTextarea className="category-text" name="category1text" placeholder="Category 1" /></th>
          <th><EditTextarea className="category-text" name="category2text" placeholder="Category 2" /></th>
          <th><EditTextarea className="category-text" name="category3text" placeholder="Category 3" /></th>
          <th><EditTextarea className="category-text" name="category4text" placeholder="Category 4" /></th>
          <th><EditTextarea className="category-text" name="category5text" placeholder="Category 5" /></th>
        </tr>
        {[...Array(5)].map((_, i) =>
          <tr key={'row' + i}> {[...Array(5)].map((_, j) =>
            <td key={'cell' + i + j}>
            <Button onClick={() => {selectNumber({i:i,j:j})}} 
              variant="outlined" className="jeopardy-button" 
              color={getTeamColor(winnerTable[i][j])}>
                {buttonTable[i][j]}
            </Button>
            </td>
          )}
          </tr>
        )
        }
      </tbody></table>
      <div className="main-buttons">
        <Button onClick={() => setOpenWarnReset(true)} variant="outlined" >Reset Game</Button>
        <Button onClick={() => setUploadPopup(true)} variant="outlined" >Upload File</Button>
        <Button onClick={finalJeopardy} variant="outlined" >Final Jeopardy</Button>
      </div>
      <div>
        <Toaster />
      </div>
    </main>
  )
}
