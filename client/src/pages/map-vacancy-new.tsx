export default function MapVacancyNew() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      🚨 NEW MAP VACANCY PAGE - {new Date().toLocaleString()}
      <br />
      If you see this red page, frontend updates are working!
    </div>
  );
}