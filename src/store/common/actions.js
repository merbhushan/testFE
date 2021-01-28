import {LeaderBoard} from 'src/agent'

export async function getLatestScores({commit}, params={}) {
  try{
    let response = await LeaderBoard.getScores(params);
    return response;
  } catch (error) {
    console.log(error)
    return error
  }
}
