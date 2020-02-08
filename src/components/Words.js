import React from 'react'
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

const styles = theme => ({
    fab : {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
})

const databaseURL = 'https://wordcloud-b9341.firebaseio.com';

class Words extends React.Component {
    constructor() {
        super();
        this.state = {
            words: {},
            dialog: false,
            word: '',
            weight: ''

        };
    }
    //firebase에서 데이터 가져오기
    _get(){
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status !== 200) {
            //    throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({words: words}));
    }

    //post
    _post(word){
        return fetch(`${databaseURL}/words.json`, {
            method: 'POST',
            body: JSON.stringify(word)
        }).then(res => {
            //오류나면 오류 알려주고 문제없으면 출력 json
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        //등록 되었으면 추가된 부분만 추가해서 보여줌(화면갱신)
        }).then(data => {
            let nextState = this.state.words;
            nextState[data.name] = word;
            this.setState({words: nextState});
        });
    }

    //delete => id 값으로 삭제
    _delete(id) {
        return fetch(`${databaseURL}/words/${id}.json`,{
            method: 'DELETE'
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(()=>{
            let nextState = this.state.words;
            //delete js 기본문법
            delete nextState[id];
            //삭제 이후 화면 다시 보여줌
            this.setState({words: nextState});
        })
    }
    //words가 변경이 되었을때 작동
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextState.words !== this.state.words;
    // }
    componentDidMount() {
        this._get();
    }
    //swich만 해주는 함수
    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })
    handleValueChange = (e) =>{
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    handleSubmit = () => {
        const word = {
            word: this.state.word,
            weight: this.state.weight
        }
        this.handleDialogToggle();
        if(!word.word && !word.weight){
            return;
        }
        //그렇지 않은 경우
        this._post(word);
    }
    handleDelete = (id) => {
        this._delete(id);
    }
    render(){
        const { classes } = this.props;
        return(
            <div>
                {Object.keys(this.state.words).map(id => {
                    const word = this.state.words[id];
                    return (
                        <div key={id}>
                            <Card style={{marginBottom: '10px'}}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        가중치: {word.weight}
                                    </Typography>
                                    <Grid container>
                                        <Grid item xs={6}>
                                          <Typography variant="h5" component="h2">
                                           {word.word}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Button variant="contained" color="primary" onClick={()=> this.handleDelete(id)}>Delete</Button>
                                        </Grid>
                                    </Grid>
                                  
                                </CardContent>
                            </Card>
                        </div>    
                        )
                    })}
                    <Fab color='primary' className={classes.fab} onClick={this.handleDialogToggle}>
                        <AddIcon />
                    </Fab>
                    <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                        <DialogTilte>단어추가</DialogTilte>
                        <DialogContent>
                            <TextField label="단어" type="text" name="word" value={this.state.word} onChange={this.handleValueChange}/><br />
                            <TextField label="가중치" type="text" name="weight" value={this.state.weight} onChange={this.handleValueChange}/><br />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                            <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>

                        </DialogActions>
                    </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(Words);