const currentTeamMember = localStorage.getItem("careteamMember");
const parsedTeamMember = currentTeamMember
  ? JSON.parse(currentTeamMember)
  : null;
const token = parsedTeamMember?.token || "";

export const AuthHeader = {
  Authorization: `Bearer ${token}`,
};
