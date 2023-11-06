import Nav from './components/Nav';
import CropImage from './pages/CropImage';
import PrepareToMKVToolNix from './pages/PrepareToMKVToolNix';

const App = () => {
  return (
    <div className="main p-3 bg-light">
      <div className="d-flex flex-column gap-3">
        <Nav.Tabs id="appTabs">
          <Nav.TabItem id="prepareToMKVToolNix" isActive={true}>
            Prepare to MKVToolNix
          </Nav.TabItem>
          <Nav.TabItem id="cropImage">Crop Image</Nav.TabItem>
        </Nav.Tabs>
        <Nav.TabsContent id="appTabs">
          <Nav.TabContentItem id="prepareToMKVToolNix" isActive={true}>
            <PrepareToMKVToolNix />
          </Nav.TabContentItem>
          <Nav.TabContentItem id="cropImage">
            <CropImage />
          </Nav.TabContentItem>
        </Nav.TabsContent>
      </div>
    </div>
  );
};

export default App;
