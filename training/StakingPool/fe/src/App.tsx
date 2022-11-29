import { useEffect, useRef, useState } from "react";
import Web3 from "web3";
import * as jsonContract from "../../build/contracts/StakingNCCToken.json";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

type Staker = {
  stakedApy: string;
  stakedTime: string;
  stakedAmount: string;
  stakerAddress: string;
  unStakedToken: string;
  reward: string;
};

function App() {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7654");
  const contract = new web3.eth.Contract(
    jsonContract.abi as any,
    jsonContract.networks[5777].address
  );

  const [accounts, setAccounts] = useState<string>("");
  const [staker, setStaker] = useState<Staker>({});
  const [stakedToken, setStakedToken] = useState<string>("");
  const [poolDetails, setPoolDetails] = useState<[]>([]);
  const [shareholders, setShareholders] = useState<Staker[]>([]);
  const isFistRun = useRef<boolean>(true);

  const getAccounts = async () => {
    const account = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    setAccounts(account[0]);
  };

  window.ethereum?.on("accountsChanged", (accounts: any) => {
    setAccounts(accounts[0]);
  });

  const getStakedToken = async () => {
    const balance = await web3.eth.getBalance(accounts);
    setStakedToken(balance);
  };

  const getStaker = async (accounts: string) => {
    const staker = await contract.methods.stakers(accounts).call();
    const balance = await contract.methods.getTokensOf(accounts).call();
    const reward = await contract.methods.getReward(accounts).call();
    setStaker({ ...staker, unStakedToken: balance, reward: reward });
  };

  const getAllStakers = async () => {
    const allStakers = await contract.methods.getAllStakers().call();
    setShareholders(allStakers);
  };

  const getPoolDetails = async () => {
    const poolDetails = await contract.methods.getPoolDetails().call();
    setPoolDetails(poolDetails);
  };

  useEffect(() => {
    if (isFistRun.current) {
      isFistRun.current = false;
      getAccounts();
      return;
    }
    getAllStakers();
    getStakedToken();
    getPoolDetails();
    getStaker(accounts);
  }, [accounts]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Staking NCC Token
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            Hello,&nbsp;<b>${accounts}</b>!
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 10 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      <Typography variant="h5">Pool Details</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Owner</Typography>
                    </TableCell>
                    <TableCell align="right">{poolDetails[0]}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Shareholders</Typography>
                    </TableCell>
                    <TableCell align="right"> {poolDetails[1]}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Total</Typography>
                    </TableCell>
                    <TableCell align="right"> {poolDetails[2]}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Status</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {poolDetails[3] == 0 ? (
                        <Typography variant="body2" style={{ color: "green" }}>
                          Opened
                        </Typography>
                      ) : (
                        <Typography variant="body2" style={{ color: "green" }}>
                          Closed
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      <Typography variant="h5">User Info</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Id</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {accounts.toUpperCase()}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Total Staked</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {staker.stakedAmount || 0} NCC
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Reward</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {staker.reward || 0} NCC
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">UnStaked</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {staker.unStakedToken || 0} NCC
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="h5">Stake NCC Token</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Id</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Total Staked</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Reward</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shareholders.map((shareholder, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      {shareholder.stakerAddress}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      {shareholder.stakedAmount} NCC
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2">
                      {shareholder.reward || 0} NCC
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default App;
