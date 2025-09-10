interface ThreeViewerProps {
  modelUrl?: string;
}

export default function ThreeViewer({ modelUrl }: ThreeViewerProps) {
  return (
    <div className="h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="font-semibold text-lg mb-2">Visualizador 3D</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {modelUrl ? 'Modelo 3D disponível' : 'Visualização interativa do produto'}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-center space-x-1">
            <span>🖱️</span>
            <span>Clique e arraste</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span>🔍</span>
            <span>Zoom interativo</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 opacity-75">
          Funcionalidade em desenvolvimento
        </p>
      </div>
    </div>
  );
}
