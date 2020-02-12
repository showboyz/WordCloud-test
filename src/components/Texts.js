import React from 'react'
import TextTruncate from 'react-text-truncate'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTilte from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'

const styles = theme => ({
    hidden: {
        display : 'none'
    },
    fab: {
        position : 'fixed',
        bottom : '20px',
        right : '20px'
    }
})
//database 경로
const databaseURL = 'https://wordcloud-b9341.firebaseio.com';


class Texts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            fileContent: null,
            //texts = 파이어베이스에서 받아오는 데이터셋, textName = 각각의 텍스트 아이디값(사용자가 직접입력)
            texts: {},
            textName: '',
            dialog: false
        }
    }
     //firebase에서 데이터 가져오기
    _get(){
        fetch(`${databaseURL}/texts.json`).then(res => {
            if(res.status !== 200) {
            //    throw new Error(res.statusText);
            }
            return res.json();
        }).then(texts => this.setState({texts: (texts === null) ? {} : texts }));
    }
     //post
    _post(text){
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text)
        }).then(res => {
            //오류나면 오류 알려주고 문제없으면 출력 json
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        //등록 되었으면 추가된 부분만 추가해서 보여줌(화면갱신)
        }).then(data => {
            let nextState = this.state.texts;
            nextState[data.name] = text;
            this.setState({texts: nextState});
        });
    }
    //delete => id 값으로 삭제
    _delete(id) {
        return fetch(`${databaseURL}/texts/${id}.json`,{
            method: 'DELETE'
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(()=>{
            let nextState = this.state.texts;
            //delete js 기본문법
            delete nextState[id];
            //삭제 이후 화면 다시 보여줌
            this.setState({texts: nextState});
        })
    }
    //등록 되었을때 화면에 출력
    componentDidMount() {
        this._get();
    }

     //swich만 해주는 함수 false에서 true로 바꿔줌
    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: '',
        textName: ''
    })
    handleValueChange = (e) =>{
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    handleSubmit = () => {
        const text = {
            textName: this.state.textName,
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();
        if(!text.textName && !text.textContent){
            return;
        }
        //그렇지 않은 경우
        this._post(text);
    }
    handleDelete = (id) => {
        this._delete(id);
    }
    //사용자가 파일 업로드했을때, 텍스트파일 내용을 읽어서 state값을 변경, 읽어들인 것을 text라는 곳에 담아서 fileContent에 넣어준다.
    handleFileChange = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState({
                fileContent: text
            });
        }
        // 파일을 읽을수 있도록 오직하나의 파일만 읽도록 함, value값이 fileName이 된다.
        reader.readAsText(e.target.files[0], 'EUC-KR');
        this.setState({
            fileName: e.target.value
        })
    }
    render(){
        const { classes } = this.props;
        return(
        <div>
            {Object.keys(this.state.texts).map(id => {
                const text = this.state.texts[id];
                return(
                    <Card key={id}>
                        <CardContent>
                            <Typography color='textSecondary' gutterBottom>
                                내용 : {text.textContent.substring(0, 24) + '...'}
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant='h5' component='h2'>
                                        {text.textName.substring(0, 14) + '...'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                      <Link component={RouterLink} to={'detail/' + id}>
                                            <Button variant='contained' color='primary'>보기</Button>
                                      </Link>       
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant='h5' component='h2'>
                                        <Link>
                                            <Button variant='contained' color='primary' onClick={() => this.handleDelete(id)}>삭제</Button>
                                        </Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )
            })}
            <Fab color='primary' className={classes.fab} onClick={this.handleDialogToggle}>
                <AddIcon />
            </Fab>
            <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                <DialogTilte>텍스트 추가</DialogTilte>
                <DialogContent>
                    <TextField label='텍스트 이름' type='text' name='textName' value={this.state.textName} onChange={this.handleValueChange} /> <br />
                    <input className={classes.hidden} accept='text/plain' id='raised-button-file' type='file' file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} /> <br />
                    <label htmlFor='raised-button-file'>
                        <Button variant='contained' color='primary' component='span' name='file'>
                            {this.state.fileName === '' ? '.txt 파일 선택' : this.state.fileName}
                        </Button>
                    </label>
                    <TextTruncate
                         line={1}
                         truncateText='...'
                         text={this.state.fileContent}
                    />
                </DialogContent>
                <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                </DialogActions>
            </Dialog>
        </div>    
        );
    }
}

export default  withStyles(styles)(Texts);