
export const getAuthHeader = () => {
  const currentTeamMember = localStorage.getItem("careteamMember");
  const parsedTeamMember = currentTeamMember
    ? JSON.parse(currentTeamMember)
    : null;
  const token = parsedTeamMember?.token || "";

  return {
    Authorization: `Bearer ${token}`,
  };
};
