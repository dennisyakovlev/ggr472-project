function genIndexPoly()
{
    map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-opacity', 1);
    map.setPaintProperty(borderName(DATA_NAME.MAIN), 'line-opacity', 1);
}

function forceSafeClearIndexPoly()
{
    map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-opacity', 0);
    map.setPaintProperty(borderName(DATA_NAME.MAIN), 'line-opacity', 0);
}