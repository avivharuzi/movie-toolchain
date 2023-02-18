import Nav from './components/Nav';
import PrepareToMKVToolNix from './pages/PrepareToMKVToolNix';

const App = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <Nav.Tabs id="appTabs">
        <Nav.TabItem id="prepareToMKVToolNix" isActive={true}>
          Prepare to MKVToolNix
        </Nav.TabItem>
      </Nav.Tabs>
      <Nav.TabsContent id="appTabs">
        <Nav.TabContentItem id="prepareToMKVToolNix" isActive={true}>
          <PrepareToMKVToolNix />
        </Nav.TabContentItem>
      </Nav.TabsContent>
    </div>
  );
};

export default App;
