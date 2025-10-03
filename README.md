# Mid-Atlantic Elevation Map Dataset

This dataset provides a high-resolution (1-meter per pixel) Canopy Height Models (CHM) for the mid-Atlantic region of the United States, estimating vegetation elevation relative to the ground. Developed using deep learning models trained on high-resolution RGB imagery, it offers a cost-effective alternative to traditional LiDAR surveys, achieving superior accuracy compared to existing CHM datasets. Created as part of PhD research at the University of Delaware, this dataset targets researchers, policymakers, and practitioners in ecology, forestry, urban planning, hydrology, and climate science, supporting applications from biodiversity conservation to disaster management. Its open access maximizes impact, aligning with the goals of the Open Data Impact Award.

## Dataset Description

- **Spatial Coverage**: Mid-Atlantic U.S., including Delaware, Maryland, New Jersey, and Virginia (Bounding Box: 36.5636, -83.7165, 41.4006, -73.8454).
- **Resolution**: 1 meter per pixel.
- **Format**: GeoTIFF (raster).
- **Units**: Vegetation height in meters, relative to ground elevation.
- **Temporal Scope**: Derived from RGB imagery captured in 2023.
- **Input Data**: High-resolution (1m) RGB imagery from the National Agriculture Imagery Program (NAIP), with limited airborne LiDAR for validation.
- **Size**: Approximately 468 GB (compressed).

## Impact

This dataset’s high resolution and open access enable transformative applications across multiple fields:
- **Ecology and Biodiversity**: Maps habitats for species like birds and mammals, monitors invasive species, and assesses ecosystem health in mid-Atlantic forests.
- **Forestry**: Estimates above-ground biomass for carbon accounting, monitors forest health, and supports sustainable timber management.
- **Urban Planning**: Guides urban forestry and green space planning in cities like Philadelphia and Baltimore, mitigating urban heat islands.
- **Hydrology**: Models flood risks and watershed dynamics in the Mid-Atlantic region, aiding water resource management.
- **Disaster Management**: Assesses wildfire risks and post-storm vegetation damage, enhancing resilience in coastal zones.
- **Climate Research**: Supports carbon sequestration studies and land use change analysis under climate scenarios.

**Stakeholders** include University of Delaware departments (Geography and Spatial Sciences, Plant and Soil Sciences, Data Science Institute, College of Earth, Ocean and Environment), government agencies (USGS, Delaware DNREC, Chesapeake Bay Program), private sectors (environmental consulting, agrotech), and global researchers. Open access amplifies collaboration, enabling interdisciplinary research and policy decisions, as recognized by the Open Data Impact Award’s collaboration between UD Library, Data Science Institute, and EPSCoR.

## Access

- **Zenodo**: Available at [Insert Zenodo DOI or placeholder link, e.g., https://zenodo.org/record/XXXXXXX].
- **Project Website**: [Insert project website, e.g., https://www.udel.edu/your-project-page].
- **Dataset Directory**: Organized as tiled GeoTIFFs by state (e.g., `DE_CHM_1m.tif`, `MD_CHM_1m.tif`) for efficient access.

### Tools

- **GIS Software**: Compatible with QGIS, ArcGIS, or similar for visualization and analysis.
- **Python Scripts**: Use libraries like `rasterio`, `geopandas`, or `GDAL` for processing. Sample scripts for loading and analyzing the dataset are available at [Insert GitHub link or repository].

### Python

Example script to load and visualize a CHM tile:
```python
import rasterio
import matplotlib.pyplot as plt

# Load GeoTIFF
with rasterio.open('DE_CHM_1m.tif') as src:
    chm = src.read(1)  # Read first band (height in meters)

# Visualize
plt.imshow(chm, cmap='viridis')
plt.colorbar(label='Canopy Height (m)')
plt.title('Delaware Canopy Height Map')
plt.show()
```
Ensure sufficient memory for large rasters. See [GitHub link] for additional scripts.

## License

This dataset is licensed under **Creative Commons CC BY 4.0**, allowing free use with attribution. Please cite as:  
[Your Name]. (2025). Mid-Atlantic Elevation Map Dataset. University of Delaware. [Insert DOI or URL].

## Generation Process

### Methodology (Kevin Model)

The CHM was generated using a deep learning model, referred to as the "Kevin Model," a generative neural network designed for image translation. The model was trained to estimate vegetation height from 1m-resolution RGB imagery, leveraging super-resolution and gap-filling techniques to enhance low-quality or missing LiDAR measurements. The architecture combines convolutional layers with generative adversarial networks (GANs) to predict canopy height with high accuracy. Validation against airborne LiDAR data yielded an RMSE of [Insert value, e.g., 0.5 meters], outperforming global datasets like GEDI. Limitations include reduced accuracy in urban areas with sparse vegetation or under cloud-covered RGB inputs.

### Input (Fabian Description for NAIP)

The primary input is high-resolution (1m) RGB imagery from the National Agriculture Imagery Program (NAIP), collected during leaf-on conditions in 2023–2024. NAIP imagery provides red, green, and blue bands, capturing detailed vegetation patterns across the mid-Atlantic. Limited airborne LiDAR data from [source, e.g., USGS 3DEP] was used for training and validation, providing ground-truth canopy heights. Preprocessing included radiometric correction and alignment to ensure consistency across tiles.

### Output (Characteristics of Files and CHM)

- **File Format**: GeoTIFF, georeferenced to EPSG:32618 (UTM Zone 18N).
- **Structure**: Tiled rasters by state for manageable processing (e.g., `DE_CHM_1m.tif`, `MD_CHM_1m.tif`).
- **CHM Characteristics**: Pixel values represent vegetation height in meters relative to ground elevation, ranging from 0 (ground or low vegetation) to [max height, e.g., 40m] for tall trees. Each tile includes metadata on spatial extent and projection.
- **Quality**: High accuracy (e.g., R² = [Insert value, e.g., 0.9] against LiDAR), with minor errors in dense urban or cloudy areas.
## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
