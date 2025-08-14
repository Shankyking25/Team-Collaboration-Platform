const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const projectValidation = require('../../validations/projectValidation');




router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





// // GET /api/projects/:projectId/members

// router.get('/:projectId/members', async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.projectId).populate('members', 'name');
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     res.json(project.members); // [{ _id, name }]
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// router.post('/', authenticate, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
//   const { error } = projectValidation.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     const project = new Project({ ...req.body, teamId: req.user.teamId });
//     await project.save();
//     res.status(201).json(project);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// router.post(
//   '/',
//   authenticate,
//   authorizeRoles('ADMIN'), // only ADMIN can create
//   async (req, res) => {
//     const { error } = projectValidation.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     try {
//       const project = new Project({ ...req.body, teamId: req.user.teamId });
//       await project.save();
//       res.status(201).json(project);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );


router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put('/:id', authenticate, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
  const { error } = projectValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, teamId: req.user.teamId },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, teamId: req.user.teamId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
