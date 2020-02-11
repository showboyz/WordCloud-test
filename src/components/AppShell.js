import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'

const styles = {
    root: {
        flexGrow: 1,
    },
    //왼쪽 정렬
    menuButton: {
        marginRight: 'auto'
    },
};

class AppShell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false
        };
    }
    //toggle 실행하면 반대값 실행
    handleDrawerToggle = () => this.setState({ toggle: !this.state.toggle })
    render() {
        const { classes } = this.props;
        return (
         <div>
            <div className={classes.root}>
                <AppBar position="fixed">
                    <IconButton className={classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </AppBar>
                <Drawer open={this.state.toggle}>
                    <MenuItem onClick={this.handleDrawerToggle}>
                        <Link component={RouterLink} to='/'>
                            ____Home____
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleDrawerToggle}>
                        <Link component={RouterLink} to='/texts'>
                            ____Texts____
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleDrawerToggle}>
                        <Link component={RouterLink} to='/words'>
                            ____Words____
                        </Link>
                    </MenuItem>


                </Drawer>
            </div>
            <div id="content" style={{margin: 'auto', marginTop: '80px', marginLeft: '20px', marginRight: '20px'}}>
                {React.cloneElement(this.props.children)}
            </div>
         </div>  
        );
    }
}

export default withStyles(styles)(AppShell);
